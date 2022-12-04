const Discord = require("discord.js");

module.exports = {
    name: "roles",
    description: "Ajoute ou retire un rôle grâce à la réaction d'un message",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "action",
            description: "Ajouter/Retirer",
            required: true,
            autocomplete: true
        },
        {
            type: "role",
            name: "role",
            description: "Le rôle à ajouter ou retirer",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let action = args.getString("action");
        if (action !== "add" && action !== "remove") return message.reply("Indiquez \`add\` ou \`remove\` !");

        let role = args.getRole("role");
        if (!message.guild.roles.cache.get(role.id)) return message.reply("Pas de rôle trouvé !");
        if (role.managed) return message.reply("Indiquez un rôle non géré !");

        if (action === "add") {
            db.query(`SELECT * FROM server WHERE guild = '${message.guildId}'`, async (e, req) => {
                let roles = req[0].reactionrole.split(" ");
                if (roles.length >= 25) return message.reply("Vous ne pouvez pas rajouter de rôles !");
                if (roles.includes(role.id)) return message.reply("Ce rôle est déjà dans le réaction rôle !");

                await roles.push(role.id);
                db.query(`UPDATE server SET reactionrole = '${roles.filter(e => e !== "").join(" ")}' WHERE guild = '${message.guildId}'`);
                await message.reply(`Le rôle \`${role.name}\` a été ajouté au réaction rôle !`);
            });
        }

        if (action === "remove") {
            db.query(`SELECT * FROM server WHERE guild = '${message.guildId}'`, async (e, req) => {
                let roles = req[0].reactionrole.split(" ");
                if (roles.length <= 0) return message.reply("Aucun rôle à retirer !");
                if (!roles.includes(role.id)) return message.reply("Ce rôle n'est pas dans le réaction rôle !");
                
                let number = roles.indexOf(role.id);
                delete roles[number];

                db.query(`UPDATE server SET reactionrole = '${roles.filter(e => e !== "").join(" ")}' WHERE guild = '${message.guildId}'`);;
                await message.reply(`Le rôle \`${role.name}\` a été retiré du réction rôle !`);
            });
        }
    }
};