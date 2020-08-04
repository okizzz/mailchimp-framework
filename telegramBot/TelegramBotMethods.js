import TelegramBot from "node-telegram-bot-api";

export default class TelegramBotMethods extends TelegramBot {
  constructor(apiKeyBotTelegram, chatId) {
    super(apiKeyBotTelegram);
    this.chatId = chatId;
  }
  sendMsgChat = (msgChat) => {
    this.sendMessage(this.chatId, `<b>${msgChat}</b>`, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  };
}
