const dotenv = require('dotenv').config();
const Telegraf = require('telegraf');
const Keyboard = require('telegraf-keyboard');
const LocalSession = require('telegraf-session-local')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('modern', (ctx) => ctx.reply('Yo'));
bot.command('hipster', (ctx) => ctx.reply('λ'));

bot.startPolling();