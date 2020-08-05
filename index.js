import dotenv from "dotenv";
import startCompaignPassengers from "./companies/PassengersCompaign.js";
import async from "async";
import MailchimpMethods from "./mailchimp/MailchimpMethods.js";
import MongooseMethods from "./mongo/MongooseMethods.js";
import TelegramBotMethods from "./telegramBot/TelegramBotMethods.js";
import startWriteLog from "./logging/StartWriteLog.js";
const configEnv = dotenv.config({ path: process.argv[1].replace("index.js", ".env") });

if (process.argv[2] == "--help") {
  console.dir({ Help: "--help", "Start passengers company": "--passengers" });
  process.exit(0);
}

if (process.argv[2] == undefined || process.argv[2] != "--passengers") {
  console.log("wrong argument");
  process.exit(100);
} else {
  startCompaignPassengers(
    MailchimpMethods,
    MongooseMethods,
    TelegramBotMethods,
    async,
    configEnv,
    startWriteLog,
  );
}
