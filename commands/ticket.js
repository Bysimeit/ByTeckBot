const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    description: "Contacter le support du serveur",
    permission: "Aucune",
    dm: true,
    category: "Utilisateurs",
    options: [],

    async run(bot, message, args, db) {
        let Embed = new Discord.EmbedBuilder()
        .setColor("#007CFF")
        .setTitle("Création d'un ticket")
        .setDescription("Appuyer sur le bouton ci-dessous pour contacter les responsables du serveur.")
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setFooter({text: bot.user.username});

        const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("Créer un ticket")
        .setStyle(Discord.ButtonStyle.Primary)
        .setEmoji("🎫"));

        await message.reply({embeds: [Embed], components: [btn]});
    }
};