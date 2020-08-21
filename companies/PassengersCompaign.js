import config from "../configs/PassengersCompaignConf.js";
import startCompaign from "../controllers/StartCompaign.js";

const { API_KEY_MAILCHIMP, DB_URL, API_KEY_BOT, CHAT_ID } = process.env;
const {
  listId,
  subjectLineEmail,
  previewTextEmail,
  compaignName,
  templateId,
  dbName,
  objConfMongoConnect,
  modelName,
  objConfMongoModel,
  collectionName,
  querydb,
  envName,
} = config;

export default function startCompaignPassengers(
  MailchimpMethods,
  MongooseMethods,
  TelegramBotMethods,
  async,
  dotenv,
  startWriteLog,
) {
  dotenv.config({ path: process.argv[1].replace("index.js", envName) });

  const mailchimpMethods = new MailchimpMethods(
    API_KEY_MAILCHIMP,
    listId,
    subjectLineEmail,
    previewTextEmail,
    compaignName,
    templateId,
  );
  const mongooseMethods = new MongooseMethods(
    DB_URL,
    dbName,
    objConfMongoConnect,
    modelName,
    objConfMongoModel,
    collectionName,
    querydb,
  );
  const telegramBotMethods = new TelegramBotMethods(API_KEY_BOT, CHAT_ID);

  startCompaign(
    mailchimpMethods,
    mongooseMethods,
    telegramBotMethods,
    async,
    startWriteLog,
  );
}
