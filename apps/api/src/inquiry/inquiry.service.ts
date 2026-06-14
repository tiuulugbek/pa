import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateContactDto, CreateInquiryDto } from './dto';

function nowFormatted(): string {
  // 12:05, 11-Iyun 2026
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Tashkent',
  }).format(new Date());
}

function esc(s: string | null | undefined): string {
  if (!s) return '—';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

@Injectable()
export class InquiryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async createInquiry(dto: CreateInquiryDto) {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        productId: dto.productId,
        telegramUserId: dto.telegramUserId,
        telegramUsername: dto.telegramUsername,
        name: dto.name,
        phone: dto.phone,
        company: dto.company,
        message: dto.message,
      },
    });

    let productName = '—';
    if (dto.productId) {
      const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
      if (product) productName = product.nameUz;
    }

    const text =
      `🔔 <b>Yangi soʻrov!</b>\n` +
      `📦 Mahsulot: ${esc(productName)}\n` +
      `👤 Foydalanuvchi: ${dto.telegramUsername ? '@' + esc(dto.telegramUsername) : esc(dto.name)}\n` +
      `📱 Telegram ID: ${esc(dto.telegramUserId)}\n` +
      `📞 Telefon: ${esc(dto.phone)}\n` +
      `🏢 Kompaniya: ${esc(dto.company)}\n` +
      `💬 Xabar: ${esc(dto.message)}\n` +
      `⏰ Vaqt: ${nowFormatted()}`;

    await this.telegram.sendToAdmin(text, inquiry.id);
    return { ok: true, id: inquiry.id };
  }

  async createContact(dto: CreateContactDto) {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        company: dto.company,
        message: `[${dto.industry ?? 'Umumiy'}] ${dto.message}`,
      },
    });

    const text =
      `📬 <b>Aloqa formasi</b>\n` +
      `👤 Ism: ${esc(dto.name)}\n` +
      `🏢 Kompaniya: ${esc(dto.company)}\n` +
      `📞 Telefon: ${esc(dto.phone)}\n` +
      `🏭 Soha: ${esc(dto.industry)}\n` +
      `💬 Xabar: ${esc(dto.message)}\n` +
      `⏰ Vaqt: ${nowFormatted()}`;

    await this.telegram.sendToAdmin(text, inquiry.id);
    return { ok: true, id: inquiry.id };
  }
}
