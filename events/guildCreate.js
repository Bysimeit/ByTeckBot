const Discord = require("discord.js");

module.exports = async (bot, guild) => {
    let db = bot.db;

    db.query(`SELECT * FROM server WHERE guild = '${guild.id}'`, async (e, req) => {
        if (req.length < 1) {
            db.query(`INSERT INTO server (guild, captcha) VALUES ('${guild.id}', 'false')`);
        }
    });
};