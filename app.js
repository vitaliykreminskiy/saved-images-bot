const dotenv = require('dotenv').config();
const request = require('request');
const Telegraf = require('telegraf');
const Keyboard = require('telegraf-keyboard');
const LocalSession = require('telegraf-session-local')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('random', (ctx) => {
    const endpoint = 'http://api.vk.com/photos.get?access_token=' + process.env.VK_TOKEN + '&album_id=saved&v=5.103';
    request (
        {
            method: 'GET',
            uri: endpoint
        }, (error, response, body) => {
            let decodedResponse = JSON.parse(body);
            ctx.reply(decodedResponse.response.count);
        }
    )
});

bot.startPolling();