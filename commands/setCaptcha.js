const Discord = require("discord.js");

module.exports = {
    name: "setcaptcha",
    description: "Paramètre du captcha",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "état",
            description: "État du captcha (on ou off)",
            required: true,
            autocomplete: true
        },
        {
            type: "channel",
            name: "salon",
            description: "Salon où y mettre le captcha",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let state = args.getString("état");
        if (state !== "on" && state !== "off") return message.reply("Veuillez mettre \`on\` ou \`off\`");

        if (state === "off") {
            db.query(`UPDATE server SET captcha = 'false' WHERE guild = '${message.guildId}'`);
            await message.reply("Le captcha est bien désactivé !");
        } else {
            let channel = args.getChannel("salon");
            if (!channel) return message.reply("Indiquer le salon pour y activer le captcha !");

            channel = message.guild.channels.cache.get(channel.id);
            if (!channel) return messsage.reply("Pas de salon trouvé !");

            db.query(`UPDATE server SET captcha = '${channel.id}' WHERE guild = '${message.guildId}'`);
            await message.reply(`Le captcha est bien activé sur le salon ${channel} !`);
        }
    }
};