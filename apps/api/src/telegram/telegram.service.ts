import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface InlineButton {
  text: string;
  callback_data: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.ADMIN_CHAT_ID;

  private get apiBase(): string {
    return `https://api.telegram.org/bot${this.token}`;
  }

  /**
   * Sends a formatted message to the admin group. Silently logs and returns
   * false if the bot token / chat id are not configured (e.g. local dev),
   * so inquiry submission never fails because of Telegram.
   */
  async sendToAdmin(text: string, inquiryId?: number): Promise<boolean> {
    if (!this.token || !this.chatId) {
      this.logger.warn('Telegram not configured — message not sent:\n' + text);
      return false;
    }

    const reply_markup =
      inquiryId !== undefined
        ? {
            inline_keyboard: [
              [
                { text: 'Koʻrildi ✅', callback_data: `seen_${inquiryId}` },
                { text: 'Javob berildi 💬', callback_data: `replied_${inquiryId}` },
              ] as InlineButton[],
            ],
          }
        : undefined;

    try {
      await axios.post(`${this.apiBase}/sendMessage`, {
        chat_id: this.chatId,
        text,
        parse_mode: 'HTML',
        reply_markup,
      });
      return true;
    } catch (err) {
      this.logger.error('Failed to send Telegram message', err as Error);
      return false;
    }
  }
}
