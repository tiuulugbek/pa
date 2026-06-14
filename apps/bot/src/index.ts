import 'dotenv/config';
import { Telegraf, Markup, Context } from 'telegraf';
import { prisma } from '@pa/db';

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set. Bot cannot start.');
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

const statusButtons = (inquiryId: number) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback('Koʻrildi ✅', `seen_${inquiryId}`),
      Markup.button.callback('Javob berildi 💬', `replied_${inquiryId}`),
    ],
  ]);

// ---------------- /start (with optional product_<id> payload) ----------------
bot.start(async (ctx) => {
  // Telegraf versions differ on payload access; parse from the raw text to be safe.
  const rawText = 'text' in ctx.message ? ctx.message.text : '';
  const payload = rawText.replace(/^\/start(@\w+)?\s*/, '').trim();
  const match = /^product_(\d+)$/.exec(payload);

  if (!match) {
    await ctx.reply(
      'Assalomu alaykum! Power Automation botiga xush kelibsiz. 🏭\n\n' +
        'Bizning saytdan mahsulot tanlab, "Telegram orqali soʻrov" tugmasini bosing — soʻrovingizni shu yerda qabul qilamiz.',
    );
    return;
  }

  const productId = Number(match[1]);
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    await ctx.reply('Kechirasiz, bu mahsulot topilmadi. Iltimos, saytdan qaytadan urinib koʻring.');
    return;
  }

  const from = ctx.from;
  const inquiry = await prisma.inquiry.create({
    data: {
      productId: product.id,
      telegramUserId: from ? String(from.id) : null,
      telegramUsername: from?.username ?? null,
      name: from ? [from.first_name, from.last_name].filter(Boolean).join(' ') : null,
      message: `Telegram orqali soʻrov: ${product.nameUz}`,
    },
  });

  await ctx.reply(
    `✅ Soʻrovingiz qabul qilindi!\n\n` +
      `📦 Mahsulot: <b>${product.nameUz}</b>\n\n` +
      `Mutaxassislarimiz tez orada siz bilan bogʻlanadi. Rahmat!`,
    { parse_mode: 'HTML' },
  );

  // Notify admin group
  if (adminChatId) {
    const text =
      `🔔 <b>Yangi soʻrov!</b>\n` +
      `📦 Mahsulot: ${product.nameUz}\n` +
      `👤 Foydalanuvchi: ${from?.username ? '@' + from.username : inquiry.name ?? '—'}\n` +
      `📱 Telegram ID: ${from?.id ?? '—'}\n` +
      `⏰ Vaqt: ${nowFormatted()}`;
    await bot.telegram.sendMessage(adminChatId, text, {
      parse_mode: 'HTML',
      ...statusButtons(inquiry.id),
    });
  }
});

bot.help((ctx) =>
  ctx.reply('Saytdagi mahsulot sahifasidan "Telegram orqali soʻrov" tugmasini bosing.'),
);

// ---------------- Admin inline buttons → update inquiry status ----------------
bot.action(/^seen_(\d+)$/, async (ctx) => {
  const id = Number(ctx.match[1]);
  await updateStatus(ctx, id, 'SEEN', 'Koʻrildi ✅');
});

bot.action(/^replied_(\d+)$/, async (ctx) => {
  const id = Number(ctx.match[1]);
  await updateStatus(ctx, id, 'REPLIED', 'Javob berildi 💬');
});

async function updateStatus(
  ctx: Context,
  id: number,
  status: 'SEEN' | 'REPLIED',
  label: string,
): Promise<void> {
  try {
    await prisma.inquiry.update({ where: { id }, data: { status } });
    await ctx.answerCbQuery(`Holat yangilandi: ${label}`);
    const message = ctx.callbackQuery?.message;
    if (message && 'text' in message) {
      await ctx.editMessageText(`${message.text}\n\n— Holat: <b>${label}</b>`, {
        parse_mode: 'HTML',
      });
    }
  } catch (err) {
    console.error('Failed to update inquiry status', err);
    await ctx.answerCbQuery('Xatolik yuz berdi');
  }
}

// ---------------- Launch ----------------
void bot.launch().then(() => console.log('🤖 Power Automation bot started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
