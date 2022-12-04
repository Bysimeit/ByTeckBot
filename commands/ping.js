const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "Affiche la latence",
    permission: "Aucune",
    dm: true,
    category: "Utilisateurs",

    async run(bot, message, args) {
        await message.reply(`Pong ! :zany_face:\nLatence : \`${bot.ws.ping}\` ms`);
    }
};