const Discord = require("discord.js");
const Canvas = require("discord-canvas-easy");

module.exports = {
    name: "rank",
    description: "Donne l'expérience d'un membre",
    permission: "Aucune",
    dm: false,
    category: "Utilisateurs",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à afficher",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {
        let user;
        if (args.getUser("membre")) {
            user = args.getUser("membre");
            if (!user ||!message.guild.members.cache.get(user?.id)) return message.reply("Pas de membre !");
        } else user = message.user;

        db.query(`SELECT * FROM exp WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (e, req) => {
            db.query(`SELECT * FROM exp WHERE guild = '${message.guildId}'`, async (e, all) => {
                if (req.length < 1) return message.reply("Ce membre n'a pas d'exp !");

                await message.deferReply();

                const calculXp = (xp, level) => {
                    let xpTotal = 0;
    
                    for (let i = 0; i < level + 1; i++) {
                        xpTotal += i * 1000;
                    }

                    xpTotal += xp;
                    return xpTotal;
                }

                let leaderboard = await all.sort(async (a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)));
                let xp = parseInt(req[0].xp);
                let level = parseInt(req[0].level);
                let rank = leaderboard.findIndex(r => r.user === user.id) + 1;
                let need = level + 1 * 1000;

                let Card = await new Canvas.Card()
                .setBackground("https://wallpaperaccess.com/full/1836504.jpg")
                .setBot(bot)
                .setColorFont("#FFFFFF")
                .setRank(rank)
                .setUser(user)
                .setColorProgressBar("#007CFF")
                .setGuild(message.guild)
                .setXp(xp)
                .setLevel(level)
                .setXpNeed(need)
                .toCard()

                await message.followUp({files: [new Discord.AttachmentBuilder(Card.toBuffer(), {name: "rank.png"})]});
            });
        });
    }
};