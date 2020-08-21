import dotenv from "dotenv";
import async from "async";
import startCompaignPassengers from "./companies/PassengersCompaign.js";
import MailchimpMethods from "./mailchimp/MailchimpMethods.js";
import MongooseMethods from "./mongo/MongooseMethods.js";
import TelegramBotMethods from "./telegramBot/TelegramBotMethods.js";
import startWriteLog from "./logging/StartWriteLog.js";

switch (process.argv[2]) {
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
      dotenv,
      startWriteLog,
    );
    break;
  default:
    console.log("wrong argument");
    process.exit(100);
}
