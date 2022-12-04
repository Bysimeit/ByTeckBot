const Discord = require("discord.js");

module.exports = async (bot) => {
    bot.db.query(`SELECT guild FROM server`, async (e, req) => {
        if (req.length < 1) {
            return;
        }

        await bot.user.setActivity(`${req.length} serveurs`, {type: Discord.ActivityType["Watching"]});
    });
};