const Discord = require("discord.js");

module.exports = async (bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused();
        if (interaction.commandName === "help") {
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})));
        }
        if (interaction.commandName === "setcaptcha" || interaction.commandName === "setantiraid") {
            let choices = ["on", "off"];
            let output = choices.filter(c => c.includes(entry));
            await interaction.respond(entry === "" ? output.map(c => ({name: c, value: c})) : output.map(c => ({name: c, value: c})));
        }
        if (interaction.commandName === "roles") {
            let choices = ["add", "remove"];
            let output = choices.filter(c => c.includes(entry));
            await interaction.respond(entry === "" ? output.map(c => ({name: c, value: c})) : output.map(c => ({name: c, value: c})));
        }
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = require(`../commands/${interaction.commandName}`);
        command.run(bot, interaction, interaction.options, bot.db);
    }

    if (interaction.isButton()) {
        if (interaction.customId === "ticket") {
            let channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: Discord.ChannelType.GuildText
            });

            await channel.setParent(interaction.channel.parent.id);

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false
            });
            await channel.permissionOverwrites.create(interaction.user, {
                ViewChannel: true,
                EmbedLinks: true, 
                SendMessages: true,
                AttachFiles: true,
                ReadMessageHistory: true
            });

            await channel.setTopic(interaction.user.id);
            await interaction.reply({content: `Votre ticket a été créé : ${channel}`, ephemeral: true});

            let Embed = new Discord.EmbedBuilder()
            .setColor("#007CFF")
            .setTitle("Création d'un ticket")
            .setDescription("Vous pouvez expliquer votre situation dans ce salon.\nPersonne sauf les responsables et vous ont accès à ce salon.\n\nSi le problème a été résolu, veuillez cliquer sur le bouton ci-dessous pour mettre fin au ticket.")
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: bot.user.username});

            const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
            .setCustomId("closeTicket")
            .setLabel("Fermer le ticket")
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("🗑️"));

            await channel.send({embeds: [Embed], components: [btn]});
        }

        if (interaction.customId === "closeTicket") {
            let user = bot.users.cache.get(interaction.channel.topic);
            
            try {
                await user.send(`Votre ticket a été fermé.`);
            } catch (e) {}

            await interaction.channel.delete();
        }
    }

    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "reactionrole") {
            bot.db.query(`SELECT * FROM server WHERE guild = '${interaction.guildId}'`, async (e, req) => {
                let roles = req[0].reactionrole.split(" ");
                if (roles.length <= 0) return;

                await interaction.deferReply({ephemeral: true});

                let retiredroles = [];
                let addroles = [];

                for (let i = 0; i < roles.length; i++) {
                    if (interaction.member.roles.cache.has(roles[i])) {
                        try {
                            await interaction.member.roles.remove(roles[i]);
                        } catch (e) {
                            let Embed = new Discord.EmbedBuilder()
                            .setColor("#007CFF")
                            .setTitle(`Erreur : Élévation du rôle bot !`)
                            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                            .setDescription(`Pour que le bot puisse faire des modifications de rôles, veuillez mettre le rôle \`ByTeckBot\` tout en haut des autres rôles !`)
                            .setTimestamp()
                            .setFooter({text: "ByTeckBot"});
                            return interaction.followUp({embeds: [Embed]});
                        }
                        await retiredroles.push(roles[i]);
                    }
                }

                for (let i = 0; i < interaction.values.length; i++) {
                    try {
                        await interaction.member.roles.add(interaction.values[i]);
                    } catch (e) {
                        let Embed = new Discord.EmbedBuilder()
                        .setColor("#007CFF")
                        .setTitle(`Erreur : Élévation du rôle bot !`)
                        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`Pour que le bot puisse faire des modifications de rôles, veuillez mettre le rôle \`ByTeckBot\` tout en haut des autres rôles !`)
                        .setTimestamp()
                        .setFooter({text: "ByTeckBot"});
                        return interaction.followUp({embeds: [Embed]});
                    }
                    addroles.push(interaction.values[i]);
                } 

                //await interaction.followUp({content: `${addroles.length <= 0 ? " " : `Les rôles ${addroles.map(r => `\`${interaction.guild.roles.cache.get(r).name}\``).join(", ")} vous ont été ajoutés.`} ${retiredroles.length <= 0 ? " " : `Les rôles ${retiredroles.map(r => `\`${interaction.guild.roles.cache.get(r).name}\``)} vous on été retirés.`}`, ephemeral: true});
                await interaction.followUp({content: `Vos rôles ont bien été mis à jour !`, ephemeral: true});
            });
        }
    }
};