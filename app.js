const dotenv = require('dotenv').config();
const request = require('request');
const Telegraf = require('telegraf');
const Keyboard = require('telegraf-keyboard');
const LocalSession = require('telegraf-session-local')

const bot = new Telegraf(process.env.BOT_TOKEN);

const getRandomNumber = (min, max) =>  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

bot.command('random', (ctx) => {
    const endpoint = 'http://api.vk.com/method/photos.get?access_token=' + process.env.VK_TOKEN + '&album_id=saved&v=5.103';
    request (
        {
            method: 'GET',
            uri: endpoint
        }, (error, response, body) => {
            let decodedResponse = JSON.parse(body);
            let picturesCount = decodedResponse.response.count;
            let randomNumber = getRandomNumber(1, picturesCount);
            let randomPhotoUrl = decodedResponse.response.items[randomNumber].sizes[7].url;
            ctx.reply(randomPhotoUrl);
        }
    )
});

bot.startPolling();