require('dotenv').config();
const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const loadCommands = require("./loaders/loadCommands");
const loadEvents = require("./loaders/loadEvents");

bot.login(process.env.token);

bot.commands = new Discord.Collection();

bot.function = {
    createId: require("./functions/createId"),
    generateCaptcha: require("./functions/generateCaptcha")
};

loadCommands(bot);
loadEvents(bot);
