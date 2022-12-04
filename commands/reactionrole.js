const Discord = require("discord.js");

module.exports = {
    name: "reactionrole",
    description: "Envoie le réaction rôle",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "titre",
            description: "Titre pour votre réaction rôle",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "description",
            description: "Description de votre réaction rôle",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let titre = args.getString("titre");
        if (!titre) return message.reply("Veuillez écrire un titre pour votre réaction rôle !");

        let description = args.getString("description");
        if (!description) return message.reply("Veuillez écrire une description pour votre réaction rôle !");

        db.query(`SELECT * FROM server WHERE guild = '${message.guildId}'`, async (e, req) => {
            let roles = req[0].reactionrole.split(" ");
            if (roles.length <= 0 || roles[0] === '') return message.reply("Il n'y a pas de rôle enregistré !");

            let options = [];
            for (let i = 0; i < roles.length; i++) {
                let role = message.guild.roles.cache.get(roles[i]);
                await options.push({label: `@${role.name}`, value: role.id});
            }

            let Embed = new Discord.EmbedBuilder()
            .setColor("#007CFF")
            .setTitle(`${titre}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription(`${description}`)
            .setTimestamp()
            .setFooter({text: "ByTeckBot"});

            const menu = new Discord.ActionRowBuilder().addComponents(new Discord.SelectMenuBuilder()
            .setCustomId("reactionrole")
            .setMinValues(0)
            .setMaxValues(roles.length)
            .setPlaceholder("Sélectionnez vos rôles")
            .addOptions(options));

            await message.reply({embeds: [Embed], components: [menu]});
        });
    }
};