const Discord = require("discord.js");

module.exports = {
    name: "warnlist",
    description: "Affiche les warns d'un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Membre à afficher",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let user = args.getUser("membre");
        if (!user) return message.reply("Pas de membre !");
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply("Membre introuvable !");

        db.query(`SELECT * FROM warns WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (e, req) => {
            if (req.length < 1) return message.reply("Ce membre n'a pas de warn !");
            await req.sort((a, b) => parseInt(a.date) - parseInt(b.date));

            let Embed = new Discord.EmbedBuilder()
            .setColor("#007CFF")
            .setTitle(`Avertissements de ${user.tag}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "ByTeckBot"})

            for (let i = 0; i < req.length; i++) {
                Embed.addFields([{name: `Avertissement n°${i+1}`, value: `> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}>\n> **ID** : \`${req[i].warnID}\`\n> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **Raison** : \`${req[i].reason}\``}]);
            }

            await message.reply({embeds: [Embed]});
        });
    }
}