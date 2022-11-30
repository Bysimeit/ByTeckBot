const Discord = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bannir un membre du serveur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à bannir",
            required: true            
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du bannissement",
            required: false
        }
    ],

    async run(bot, message, args) {
        try {
            let user = await bot.user.fetch(args._hoistedOptions[0].value);
            if (!user) return message.reply("Pas de membre à bannir !");
            let member = message.guild.members.cache.get(user.id);

            let reason = args.get("raison").value;
            if (!reason) reason = "Pas de raison fournie.";

            if (message.user.id === user.id) return message.reply("Tu ne peux pas te bannir ;)");
            if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas bannir le propriétaire du serveur !");
            if (member && !member?.bannable) return message.reply("Je ne peux pas bannir ce membre ! :/");
            if (member && message.member.roles.highest.comparePostionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas bannir un membre qui à un rôle supérieur ou égal à toi !");
            if ((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà banni.");

            try {
                await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)
            } catch (e) {

            }

            await message.reply(`${message.user} a banni ${user.tag} pour la raison : \`${reason}\``);
            await message.guild.bans.create(user.id, {reason: reason});
        } catch (e) {
            return message.reply("Pas de membre à bannir !");
        }
    }
};