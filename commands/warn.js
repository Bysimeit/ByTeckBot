const Discord = require("discord.js");

module.exports = {
    name: "warn",
    description: "Avertir un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à warn",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "Raison de l'avertissement",
            required: false,
            autocomplete: false   
        }
    ],

    async run(bot, message, args, db) {
        let user = args.getUser("membre");
        if (!user) return message.reply("Pas de membre !");
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply("Pas de membre choisi !");

        let reason = args.getString("raison");
        if (!reason) reason = "Pas de raison fournie.";

        if (message.user.id === user.id) return message.reply("Tu ne peux pas te donner un avertissement ! :wink:");
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas donner d'avertissement au propriétaire du serveur !");
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas donner un avertissement à un membre qui à un rôle supérieur ou égal à toi !");
        if ((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Je ne peux pas donner d'avertissement à ce membre ! :face_with_diagonal_mouth:");

        try {
            await user.send(`${message.user.tag} vous a warn sur le serveur ${message.guild.name} pour la raison : \`${reason}\``);
        } catch (e) {}

        await message.reply(`Vous avez donné un avertissement à ${user.tag} pour la raison : \`${reason}\``);

        let ID = await bot.function.createId("WARN");

        db.query(`INSERT INTO warns (warnID, guild, user, author, reason, date) VALUES ('${ID}', '${message.guild.id}', '${user.id}', '${message.user.id}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`);
    }
};