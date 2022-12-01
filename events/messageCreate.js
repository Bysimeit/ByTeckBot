const Discord = require("discord.js");

module.exports = async (bot, message) => {
    let db = bot.db;
    if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (e, req) => {
        if (req.length < 1) {
            db.query(`INSERT INTO server (guild, captcha) VALUES ('${message.guild.id}', 'false')`);
        }
    });

    db.query(`SELECT * FROM exp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`, async (e, req) => {
        if (req.length < 1) {
            db.query(`INSERT INTO exp (guild, user, xp, level) VALUE ('${message.guildId}', '${message.author.id}', '0', '0')`);
        } else {
            let level = parseInt(req[0].level);
            let xp = parseInt(req[0].xp);

            if ((level + 1) * 5000 <= xp) {
                db.query(`UPDATE exp SET xp = '${xp - ((level + 1) * 1000)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
                db.query(`UPDATE exp SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);

                await message.reply(`${message.author} est passé niveau ${level + 1} ! :clap:`);
            } else {
                let xpToGive = Math.floor(Math.random() * 25) + 1;

                db.query(`UPDATE exp SET xp = '${xp + xpToGive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
            }
        }
    });
};