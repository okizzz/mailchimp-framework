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

## Системные требования
```
node v12.18.3 и выше
mongodb 
```

## Установка
```
Устанвовить все зависимости с помощью npm или yarn. Файл .env в корне каталога имеет 4 константы (API_KEY_MAILCHIMP, API_KEY_BOT, CHAT_ID, DB_URL), создайте этот файл и заполните их.
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
