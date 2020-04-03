const dotenv = require('dotenv').config();
let CronJob = require('cron').CronJob;
const request = require('request');
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const cheerio = require('cheerio');

const subscribers = require('./helpers/subscribersHelper')

const bot = new Telegraf(process.env.CV_BOT_TOKEN);
const client = new Telegram(process.env.CV_BOT_TOKEN);

const covidEndpoint = 'https://covid19.com.ua/';

let currentInfectedNumber = 0;

const updatesCheckerJob = new CronJob('0 0 * * * *', () => {
  requestCasesNumber((casesNumber) => {
    casesNumber = casesNumber.trim();
    if (currentInfectedNumber != casesNumber) {
      updateSubscribersAboutNewCases(casesNumber);
      currentInfectedNumber = casesNumber;
    }
  })
});

const updateSubscribersAboutNewCases = (casesNumber) => {
  const subscribersList = subscribers.get();
  subscribersList.forEach((subscriber) => {
    client.sendMessage(subscriber, 'Current number of Coronavirus cases in Ukraine - ' + casesNumber);
  })
}

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
    const casesNumber = $('.fields:nth-child(1) .one-field:nth-child(3) .field-value').text().trim();
    callback(casesNumber);
  })
}

bot.command('cases', (ctx) => {
  requestCasesNumber((casesNumber) => {
    casesNumber = casesNumber.trim();
    if (casesNumber !== currentInfectedNumber) {
      updateSubscribersAboutNewCases(casesNumber);
      currentInfectedNumber = casesNumber;

      return;
    }

    ctx.reply('Current number of Coronavirus cases in Ukraine - ' + casesNumber);
  })
});

bot.command('subscribe', (ctx) => {
  const senderChatId = ctx.update.message.chat.id;
  const subscribed = subscribers.has(senderChatId);

  if (subscribed) {
    subscribers.remove(senderChatId);
    client.sendMessage(senderChatId, 'You have unsubscribed from updates');

    return;
  }

  subscribers.add(senderChatId);
  client.sendMessage(senderChatId, 'You have subscribed for updates');
});

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
  const response = {       
    type: 'article',
    id: 1,
    title: 'Coronavirus in Ukraine',
    description: 'Current number of infected people is ' + currentInfectedNumber,
    thumb_url: 'https://i.ibb.co/ngdCDrh/corovavirus.png',
    input_message_content: {
      message_text: 'Current number of people infected with Coronavirus in Ukraine is ' + currentInfectedNumber
    }
  }

  return answerInlineQuery([response]);
})

const init = () => {
  requestCasesNumber((casesNumber) => {
    currentInfectedNumber = casesNumber;
  })
}

init();
updatesCheckerJob.start();
bot.startPolling();
