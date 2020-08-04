import config from "../configs/PassengersCompaignConf.js";
import startCompaign from "../controllers/StartCompaign.js";

export default function startCompaignPassengers(
  MailchimpMethods,
  MongooseMethods,
  TelegramBotMethods,
  async,
  dotenv,
  startWriteLog,
) {
  dotenv.config()
  const mailchimpMethods = new MailchimpMethods(
    process.env.API_KEY_MAILCHIMP,
    config.listId,
    config.subjectLineEmail,
    config.previewTextEmail,
    config.compaignName,
    config.templateId,
  );
  const mongooseMethods = new MongooseMethods(
    process.env.DB_URL,
    config.dbName,
    config.objConfMongoConnect,
    config.modelName,
    config.objConfMongoModel,
    config.collectionName,
    config.querydb,
  );
  const telegramBotMethods = new TelegramBotMethods(
    process.env.API_KEY_BOT,
    process.env.CHAT_ID,
  );
  startCompaign(
    mailchimpMethods,
    mongooseMethods,
    telegramBotMethods,
    async,
    startWriteLog,
  );
}
