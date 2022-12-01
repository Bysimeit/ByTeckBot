const Discord = require("discord.js");

module.exports = {
    name: "unwarn",
    description: "Retirer un avertissement d'un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "string",
            name: "idwarn",
            description: "L'identifiant de l'avertissement",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let IDWarn = args.getString("idwarn");
        if (!IDWarn) return message.reply("Veuillez y mettre un identifiant !");

        db.query(`SELECT * FROM warns WHERE warnID = '${IDWarn}' AND guild = '${message.guildId}'`, async (e, req) => {
            if (req.length < 1) return message.reply("L'identifiant de l'avertissement est introuvable");

            db.query(`DELETE FROM warns WHERE warnID = '${IDWarn}'`);

            await message.reply(`L'avertissement de ${(await bot.users.fetch(req[0].user)).tag} a été supprimé avec succès !`);
        });
    }
};