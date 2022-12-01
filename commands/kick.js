const Discord = require("discord.js");

module.exports = {
    name: "kick",
    description: "Exclure un membre du serveur",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à exclure",
            required: true            
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du kick",
            required: false
        }
    ],

    async run(bot, message, args) {
        let user = args.getUser("membre");
        if (!user) return message.reply("Pas de membre à exclure !");
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply("Pas de membre à exclure !");

        let reason = args.getString("raison");
        if (!reason) reason = "Pas de raison fournie.";

        if (message.user.id === user.id) return message.reply("Tu ne peux pas t'exclure ! :wink:");
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas exclure le propriétaire du serveur !");
        if (member && !member.kickable) return message.reply("Je ne peux pas exclure ce membre ! :face_with_diagonal_mouth:");
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas exclure un membre qui à un rôle supérieur ou égal à toi !");

        try {
            await user.send(`Tu as été exclu du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)
        } catch (e) {}

        await message.reply(`${message.user} a exclu ${user.tag} pour la raison : \`${reason}\``);
        await member.kick(reason);
    }
};