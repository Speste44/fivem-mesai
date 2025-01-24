const { ProLogs } = require("resthaven")
const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");

const config = require("../config.json");
const lg = new ProLogs()

/**
 * @param {import('discord.js').Client} client
 */

module.exports = async (client) => {
  const rest = new REST({ version: "10" }).setToken(config.API.token || process.env.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }

  lg.success(`${client.user.username} isimli bot giriş yaptı.`)

};