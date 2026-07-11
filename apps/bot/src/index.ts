import 'dotenv/config';
import { Context, Markup, Telegraf } from 'telegraf';
import { prisma } from '@pa/db';

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set. Bot cannot start.');
  process.exit(1);
}

if (!adminChatId) {
  console.error('ADMIN_CHAT_ID is not set. Bot cannot start safely.');
  process.exit(1);
}

const bot = new Telegraf(token);

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

function escapeHtml(value: string | null | undefined): string {
  if (!value) return '—';
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isAdminChat(ctx: Context): boolean {
  const chatId = ctx.chat?.id;
  return chatId !== undefined && String(chatId) === String(adminChatId);
}

const statusButtons = (inquiryId: number) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback('Koʻrildi ✅', `seen_${inquiryId}`),
      Markup.button.callback('Javob berildi 💬', `replied_${inquiryId}`),
    ],
  ]);

bot.start(async (ctx) => {
  try {
    const rawText = 'text' in ctx.message ? ctx.message.text : '';
    const payload = rawText.replace(/^\/start(@\w+)?\s*/, '').trim();
    const match = /^product_(\d{1,10})$/.exec(payload);

    if (!match) {
      await ctx.reply(
        'Assalomu alaykum! Power Automation botiga xush kelibsiz. 🏭\n\n' +
          'Bizning saytdan mahsulot tanlab, "Telegram orqali soʻrov" tugmasini bosing — soʻrovingizni shu yerda qabul qilamiz.',
      );
      return;
    }

    const productId = Number(match[1]);
    if (!Number.isSafeInteger(productId) || productId < 1) {
      await ctx.reply('Mahsulot identifikatori notoʻgʻri.');
      return;
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      select: { id: true, nameUz: true },
    });

    if (!product) {
      await ctx.reply('Kechirasiz, bu mahsulot topilmadi. Iltimos, saytdan qaytadan urinib koʻring.');
      return;
    }

    const from = ctx.from;
    const inquiry = await prisma.inquiry.create({
      data: {
        productId: product.id,
        telegramUserId: from ? String(from.id) : null,
        telegramUsername: from?.username?.slice(0, 32) ?? null,
        name: from
          ? [from.first_name, from.last_name].filter(Boolean).join(' ').slice(0, 100)
          : null,
        message: `Telegram orqali soʻrov: ${product.nameUz}`.slice(0, 2000),
      },
    });

    await ctx.reply(
      `✅ Soʻrovingiz qabul qilindi!\n\n` +
        `📦 Mahsulot: <b>${escapeHtml(product.nameUz)}</b>\n\n` +
        `Mutaxassislarimiz tez orada siz bilan bogʻlanadi. Rahmat!`,
      { parse_mode: 'HTML' },
    );

    const text =
      `🔔 <b>Yangi soʻrov!</b>\n` +
      `📦 Mahsulot: ${escapeHtml(product.nameUz)}\n` +
      `👤 Foydalanuvchi: ${from?.username ? '@' + escapeHtml(from.username) : escapeHtml(inquiry.name)}\n` +
      `📱 Telegram ID: ${escapeHtml(from ? String(from.id) : undefined)}\n` +
      `⏰ Vaqt: ${nowFormatted()}`;

    try {
      await bot.telegram.sendMessage(adminChatId, text, {
        parse_mode: 'HTML',
        ...statusButtons(inquiry.id),
      });
    } catch (error) {
      console.error(`Failed to notify admin for inquiry ${inquiry.id}`, error);
    }
  } catch (error) {
    console.error('Failed to process /start command', error);
    await ctx.reply('Soʻrovni qabul qilishda vaqtinchalik xatolik yuz berdi. Iltimos, keyinroq urinib koʻring.');
  }
});

bot.help((ctx) =>
  ctx.reply('Saytdagi mahsulot sahifasidan "Telegram orqali soʻrov" tugmasini bosing.'),
);

bot.action(/^seen_(\d+)$/, async (ctx) => {
  if (!isAdminChat(ctx)) {
    await ctx.answerCbQuery('Bu amal faqat admin guruhida mavjud');
    return;
  }
  await updateStatus(ctx, Number(ctx.match[1]), 'SEEN', 'Koʻrildi ✅');
});

bot.action(/^replied_(\d+)$/, async (ctx) => {
  if (!isAdminChat(ctx)) {
    await ctx.answerCbQuery('Bu amal faqat admin guruhida mavjud');
    return;
  }
  await updateStatus(ctx, Number(ctx.match[1]), 'REPLIED', 'Javob berildi 💬');
});

async function updateStatus(
  ctx: Context,
  id: number,
  status: 'SEEN' | 'REPLIED',
  label: string,
): Promise<void> {
  if (!Number.isSafeInteger(id) || id < 1) {
    await ctx.answerCbQuery('Notoʻgʻri soʻrov identifikatori');
    return;
  }

  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id }, select: { id: true } });
    if (!inquiry) {
      await ctx.answerCbQuery('Soʻrov topilmadi');
      return;
    }

    await prisma.inquiry.update({ where: { id }, data: { status } });
    await ctx.answerCbQuery(`Holat yangilandi: ${label}`);

    const message = ctx.callbackQuery?.message;
    if (message && 'text' in message) {
      const original = message.text.replace(/\n\n— Holat: .*$/s, '');
      await ctx.editMessageText(`${escapeHtml(original)}\n\n— Holat: <b>${escapeHtml(label)}</b>`, {
        parse_mode: 'HTML',
      });
    }
  } catch (error) {
    console.error(`Failed to update inquiry ${id}`, error);
    await ctx.answerCbQuery('Xatolik yuz berdi');
  }
}

bot.catch((error) => {
  console.error('Unhandled Telegram bot error', error);
});

void bot.launch().then(() => console.log('Power Automation bot started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
