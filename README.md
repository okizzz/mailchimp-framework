# mailchimp-framework

## Описание

Проект создан для облегчения и автоматизации работы с сервисом mailchimp. На данный момент вы можете создавать только компании(рассылки по вашим контактам). В дальнейшем проект будет развиваться и добавляться новые возможности.

## Кратко как работает

У вас есть какой-то сервис где за хранение данных отвечает mongodb. У вас есть коллекция с данными ваших пользователей, где в этой коллекции есть email адреса которые есть в вашей базе контактов mailchimp. Система берет этих пользователей и начинает по ним рассылку, а с помощью cron или jobs можно настроить так, что бы рассылки проходили регулярно.


## Структура
**index.js** - главный файл вызова скриптов, имеет несколько аргументов

**telegramBot/TelegramBotMethods.js** - класс наследующий node-telegram-bot-api, отвечает за создания экземпляра класса для отправки сообщений о событиях/ошибках в группу tg

**mongo/MongooseMethods.js** - класс наследующий mongoose, отвечает за создания экземпляра класса для получения данных из коллекции mongodb

**mailchimp/MailchimpMethods.js** - класс наследующий mongoose, отвечает за создания экземпляра класса для получения данных из коллекции mongodb

**logging/StartWriteLog.js** - функция вывода логов и вызова метода класса TelegramBotMethods для отправки событий в tg

**controllers/StartCompaign.js** - функция запускающая поочередно все необходимые методы для создания и запуска компании, построена на async.waterwall и async.retry

**configs/PassengerCompaignConf.js** - файл-json конфигурации компании и запроса к mongodb

**companies/PassengerCompaign.js** - файл компании создающий экземпляры класса и запускающий функцию StartCompaign.js, куда в качестве аргументов добавляет экземпляры класса

**.env** - файл с приватными константами


## Как работает startCompaign()

**async.waterfall**

Все операции по старту компании выполняются строго последовательно с помощью метода waterfall библиотеки async. 
Waterfall принимает в себя массив асинхронных функций и выполняет их сверху вниз передавая результат следующей функции. 
Принцип работы async.waterfall заключается в запуске callback(next) в конце каждой функции, 
она передает в качестве первого аргумента ошибку и последующие аргументы это резултаты, 
если err то запуск последовательности останавливается, eсли result то продолжается. Пример:

```javascript 
async.waterfall(
  [
    function (callback) {
      console.log("step1")
      callback(null, "one", "two");
    },
    function (arg1, arg2, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      console.log("step2")
      callback(null, "three");
    },
    function (arg1, callback) {
      // arg1 now equals 'three'
      console.log("step3")
      callback(null, "done");
    },
  ],
  function (err, result) {
    console.log("done")
    // result now equals 'done'
  },
);
```
**async.retry**

Каждая функция которая выполняется оборачивается в async.retry. 
Это позволяет повторять выполнение функции при ее ошибке, 
при удачном выполнении вызывать callback(next) async.waterfall или же когда все попытки исчерпаны, 
вызвать регистратор логов StartWriteLog и выйти из структуры. Повторение зависит от обратного вызова внутри нашей функции. 
Если первый аргумент обратного вызова не является ложным, он будет повторен на основе настроек times и interval. Пример:

```javascript 
let count = 0;
let functionData = { some: 'data' };
let myFunction = function(callback, results) {
  console.log(++count);
  process.nextTick(function() {
    if (count < 5) { // Fail 5 times
      return callback({ message: 'this failed' }, null);
    }
    callback(null, { message: 'this succeeded' });
  });
};

async.retry({times : 25, interval : 1000}, myFunction.bind(functionData), function(err, results) {
  console.log("===================================")
  console.log("Async function finished processing")
  return;
});
```


## Системные требования
```
node v12.18.3 и выше
mongodb 
```

## Установка
```
Установить все зависимости с помощью npm или yarn. Файл .env в корне каталога имеет 4 константы (API_KEY_MAILCHIMP, API_KEY_BOT, CHAT_ID, DB_URL), создайте этот файл и заполните их.
```

## Запуск
```
node index.js --key
```

## Autorun
запуск с помощью **Cron**
```
toucn start.sh
echo "/путь/до/node /путь/до/index.js --passengers > /путь/до/папкиГдеБудутЛоги/`date '+%d.%m.%Y|%H:%M'`.log" > start.sh

Пример: "/home/aezakmi/.nvm/versions/node/v12.18.3/bin/node /home/aezakmi/mailchimp-campaigns/index.js --key > /home/aezakmi/mailchimp-campaigns/log/`date '+%d.%m.%Y|%H:%M'`.log"
```
