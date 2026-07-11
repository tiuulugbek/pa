import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateContactDto, CreateInquiryDto } from './dto';

function nowFormatted(): string {
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Tashkent',
  }).format(new Date());
}

function clean(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function esc(value: string | null | undefined): string {
  if (!value) return '—';
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

@Injectable()
export class InquiryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async createInquiry(dto: CreateInquiryDto) {
    let productName = '—';
    if (dto.productId) {
      const product = await this.prisma.product.findFirst({
        where: { id: dto.productId, isActive: true },
        select: { nameUz: true },
      });
      if (!product) throw new NotFoundException('Product not found');
      productName = product.nameUz;
    }

    const data = {
      productId: dto.productId,
      telegramUserId: clean(dto.telegramUserId),
      telegramUsername: clean(dto.telegramUsername),
      name: clean(dto.name),
      phone: clean(dto.phone),
      company: clean(dto.company),
      message: dto.message.trim(),
    };

    const inquiry = await this.prisma.inquiry.create({ data });

    const text =
      `🔔 <b>Yangi soʻrov!</b>\n` +
      `📦 Mahsulot: ${esc(productName)}\n` +
      `👤 Foydalanuvchi: ${data.telegramUsername ? '@' + esc(data.telegramUsername) : esc(data.name)}\n` +
      `📱 Telegram ID: ${esc(data.telegramUserId)}\n` +
      `📞 Telefon: ${esc(data.phone)}\n` +
      `🏢 Kompaniya: ${esc(data.company)}\n` +
      `💬 Xabar: ${esc(data.message)}\n` +
      `⏰ Vaqt: ${nowFormatted()}`;

    const notified = await this.telegram.sendToAdmin(text, inquiry.id);
    return { ok: true, id: inquiry.id, notified };
  }

  async createContact(dto: CreateContactDto) {
    const name = dto.name.trim();
    const phone = dto.phone.trim();
    const company = clean(dto.company);
    const industry = clean(dto.industry);
    const message = dto.message.trim();

    const inquiry = await this.prisma.inquiry.create({
      data: {
        name,
        phone,
        company,
        message: `[${industry ?? 'Umumiy'}] ${message}`,
      },
    });

    const text =
      `📬 <b>Aloqa formasi</b>\n` +
      `👤 Ism: ${esc(name)}\n` +
      `🏢 Kompaniya: ${esc(company)}\n` +
      `📞 Telefon: ${esc(phone)}\n` +
      `🏭 Soha: ${esc(industry)}\n` +
      `💬 Xabar: ${esc(message)}\n` +
      `⏰ Vaqt: ${nowFormatted()}`;

    const notified = await this.telegram.sendToAdmin(text, inquiry.id);
    return { ok: true, id: inquiry.id, notified };
  }
}
