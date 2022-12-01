const Discord = require("discord.js");
const fs = require("fs");

module.exports = async (bot) => {
    fs.readdirSync("./commands").filter(f => f.endsWith(".js")).forEach(async file => {
        let command = require(`../commands/${file}`);
        if (!command.name || typeof command.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 3)} has no name !`);
        bot.commands.set(command.name, command);
        console.log(`Command ${file} charged successfully !`);
    });
};