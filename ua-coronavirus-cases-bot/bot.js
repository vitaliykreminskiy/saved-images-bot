const dotenv = require('dotenv').config();
var CronJob = require('cron').CronJob;
const request = require('request');
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const cheerio = require('cheerio');

const bot = new Telegraf(process.env.CV_BOT_TOKEN);
const client = new Telegram(process.env.CV_BOT_TOKEN);

const covidEndpoint = 'https://covid19.com.ua/';

let subscribers = [];
let currentInfectedNumber = 0;

const updatesCheckerJob = new CronJob('* * */3 * * *', () => {
  console.log('job triggered');
  requestCasesNumber((casesNumber) => {
    casesNumber = casesNumber.trim();
    if (currentInfectedNumber != casesNumber) {
      subscribers.forEach((subscriber) => {
        client.sendMessage(subscriber, 'Current number of Coronavirus cases in Ukraine - ' + casesNumber);
      })
      currentInfectedNumber = casesNumber;
    }
  })
});

const requestCasesNumber = (callback) => {
  request({
    method: 'GET',
    uri: covidEndpoint
  }, (error, response, body) => {
    if (error) {
      ctx.reply('An error occured. No data available');
      return;
    }

    const $ = cheerio.load(body);
    const casesNumber = $('.fields:nth-child(1) .one-field:nth-child(3) .field-value').text();
    callback(casesNumber);
  })
}

bot.command('cases', (ctx) => {
  requestCasesNumber((casesNumber) => {
    ctx.reply(casesNumber);
  })
});

bot.command('subscribe', (ctx) => {
  const senderChatId = ctx.update.message.chat.id;
  const foundIndex = subscribers.indexOf(senderChatId);

  if (foundIndex !== -1) {
    subscribers.splice(foundIndex, 1);
    client.sendMessage(senderChatId, 'You have unsubscribed from updates');

    return;
  }

  subscribers.push(senderChatId);
  client.sendMessage(senderChatId, 'You have subscribed for updates');
});

updatesCheckerJob.start();
bot.startPolling();
