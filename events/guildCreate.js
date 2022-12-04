const Discord = require("discord.js");
const loadBotStatus = require('../loaders/loadBotStatus');

module.exports = async (bot, guild) => {
    let db = bot.db;

    db.query(`SELECT * FROM server WHERE guild = '${guild.id}'`, async (e, req) => {
        if (req.length < 1) {
            db.query(`INSERT INTO server (guild, captcha, antiraid, reactionrole) VALUES ('${guild.id}', 'false', 'false', '')`);
            await loadBotStatus(bot);
        }
    });
};