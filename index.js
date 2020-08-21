import dotenv from "dotenv";
import startCompaignPassengers from "./companies/PassengersCompaign.js";
import async from "async";
import MailchimpMethods from "./mailchimp/MailchimpMethods.js";
import MongooseMethods from "./mongo/MongooseMethods.js";
import TelegramBotMethods from "./telegramBot/TelegramBotMethods.js";
import startWriteLog from "./logging/StartWriteLog.js";
const configEnv = dotenv.config({
  path: process.argv[1].replace("index.js", ".env"),
});
const arg = process.argv[2];

switch (arg) {
  case "--help":
    console.dir({
      Help: "--help",
      "Start passengers company": "--passengers",
    });
    break;
  case "--passengers":
    startCompaignPassengers(
      MailchimpMethods,
      MongooseMethods,
      TelegramBotMethods,
      async,
      configEnv,
      startWriteLog,
    );
    break;
  default:
    console.log("wrong argument");
    process.exit(100);
}
