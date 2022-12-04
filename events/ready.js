const Discord = require("discord.js");
const loadSlashCommands = require("../loaders/loadSlashCommands");
const loadDatabase = require("../loaders/loadDatabase");
const loadBotStatus = require('../loaders/loadBotStatus');

module.exports = async bot => {
    bot.db = await loadDatabase();
    bot.db.connect(function (e) {
        if (e) {
            console.log(e);
        }
        console.log("Database connected !");
    });

    await loadSlashCommands(bot);
    await loadBotStatus(bot);

    console.log(`${bot.user.tag} is online !`);
};