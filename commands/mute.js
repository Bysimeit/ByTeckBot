const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "mute",
    description: "Mute un membre",
    persmission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à mute",
            required: true
        },
        {
            type: "string",
            name: "durée",
            description: "La durée du mute",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du mute",
            required: false
        }
    ],

    async run(bot, message, args) {
        let user = args.getUser("membre");
        if (!user) return message.reply("Pas de membre !");
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply("Le membre n'existe pas !");

        let time = args.getString("durée");
        if (!time) return message.reply("Pas de durée !");
        if (isNaN(ms(time))) return message.reply("La durée n'est pas au bon format !");
        if (ms(time) > 2419200000) return message.reply("Le mute ne peut pas durer plus de 28 jours !");

        let reason = args.getString("raison");
        if (!reason) reason = "Pas de raison fournie.";
        if (message.user.id === user.id) return message.reply("Tu ne peux pas te mute :wink:");
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le propriétaire du serveur !");
        if (!member.moderatable) return message.reply("Je ne peux pas mute ce membre !");
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas exclure un membre qui à un rôle supérieur ou égal à toi !");
        if (member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute !");

        try {
            await user.send(`Tu as été mute du serveur ${message.guild.name} par ${message.user.tag} pendant ${time} millisecondes pour la raison : \`${reason}\``)
        } catch (e) {}

        await message.reply(`${message.user} a mute ${user.tag} pendant ${time} millisecondes pour la raison : \`${reason}\``);

        await member.timeout(ms(time), reason);
    }
}