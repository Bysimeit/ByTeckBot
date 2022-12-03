const Discord = require("discord.js");

module.exports = {
    name: "setantiraid",
    description: "Paramètre de l'antiraid",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "état",
            description: "État de l'antiraid (on ou off)",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, message, args, db) {
        let state = args.getString("état");
        if (state !== "on" && state !== "off") return message.reply("Veuillez mettre \`on\` ou \`off\`");

        if (state === "off") {
            db.query(`UPDATE server SET antiraid = 'false' WHERE guild = '${message.guildId}'`);
            await message.reply("L'antiraid est bien désactivé !");
        } else {
            db.query(`UPDATE server SET antiraid = 'true' WHERE guild = '${message.guildId}'`);
            await message.reply(`L'antiraid est bien activé !`);
        }
    }
};