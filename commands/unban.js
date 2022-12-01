const Discord = require("discord.js");

module.exports = {
    name: "unban",
    description: "Débannir un membre du serveur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur' à débannir",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du débannissement",
            required: false
        }
    ],

    async run(bot, message, args) {
        try {
            let user = args.getUser("utilisateur");
            if (!user) return message.reply("Pas d'utilisateur !");

            let reason = args.getString("raison");
            if (!reason) reason = "Pas de raison fournie.";

            if (!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre n'est pas banni !");

            await message.reply(`${message.user} a débanni ${user.tag} pour la raison : \`${reason}\``);

            await message.guild.members.unban(user, reason);

            try {
                await user.send(`Tu as été débanni par ${message.user.tag} pour la raison : \`${reason}\``)
            } catch (e) {}
        } catch (e) {
            return message.reply("Utilisateur introuvable !");
        }
    }
};