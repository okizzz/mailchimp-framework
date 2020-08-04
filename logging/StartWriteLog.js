export default function startWriteLog(msg, exitCode, telegramBotMethods) {
  if (exitCode === 0) {
    telegramBotMethods.sendMsgChat(
      `Mailchimp script sucefully. Message: ${msg} Key: ${
        process.argv[2]
      }. Date: ${new Date().toLocaleString("ru-Ru", {
        timeZone: "Europe/Moscow",
      })}`,
    );
  } else {
    telegramBotMethods.sendMsgChat(
      `Mailchimp script error. ExitCode: ${exitCode}. Key: ${
        process.argv[2]
      }. Please check log file. Date: ${new Date().toLocaleString("ru-Ru", {
        timeZone: "Europe/Moscow",
      })}`,
    );
  }
  console.log(msg);
  setTimeout(() => {
    process.exit(exitCode);
  }, 60000);
}