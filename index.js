const { Client, Partials, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("./config.json");
const db = require("./db.js");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  allowedMentions: {
    parse: ["everyone", "roles", "users"],
  },
  partials: Object.values(Partials),
  retryLimit: 3,
});

/**
 * @param {import('discord.js').Client} client
 */

global.client = client;
client.commands = global.commands = [];

readdirSync("./commands").forEach((f) => {
  if (!f.endsWith(".js")) return;

  const props = require(`./commands/${f}`);

  client.commands.push({
    name: props.name.toLowerCase(),
    description: props.description,
    options: props.options,
    dm_permission: props.dm_permission,
    type: 1,
  });
});

readdirSync("./events").forEach((e) => {
  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
    eve(client, ...args);
  });
});


client.login(config.API.token || process.env.token);

process.on("unhandledRejection", (error) => {
  console.log(error);
});
process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("uncaughtExceptionMonitor", (err) => {
  console.log(err);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, guildId, type] = interaction.customId.split("-");
  const userId = interaction.user.id;

  if (action === "mesai" && type === "basla") {
    const existingShift = db.get(`mesai-${guildId}-${userId}`);

    if (existingShift && existingShift.start) {
      return interaction.reply({
        content: "Zaten aktif bir mesainiz bulunuyor!",
        ephemeral: true,
      });
    }

    const startTime = Date.now();
    db.set(`mesai-${guildId}-${userId}`, { start: startTime });

    const embed = new EmbedBuilder()
      .setTitle("Mesai Başladı")
      .setDescription(
        `Mesainiz başarıyla başladı. [${new Date(startTime).toLocaleTimeString()}]`
      )
      .setColor("Green")
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (action === "mesai" && type === "bitir") {
    const shiftData = db.get(`mesai-${guildId}-${userId}`);

    if (!shiftData || !shiftData.start) {
      return interaction.reply({
        content: "Aktif bir mesainiz bulunmuyor!",
        ephemeral: true,
      });
    }

    const endTime = Date.now();
    const duration = endTime - shiftData.start;

    const totalDuration = db.get(`toplam-mesai-${guildId}-${userId}`) || 0;
    const updatedTotal = totalDuration + duration;

    db.set(`toplam-mesai-${guildId}-${userId}`, updatedTotal);
    db.delete(`mesai-${guildId}-${userId}`);

    const embedDuration = (time) => {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);

      return `${hours} saat, ${minutes} dakika, ${seconds} saniye`;
    };

    const embed = new EmbedBuilder()
      .setTitle("Mesai Bitti")
      .setDescription(
        `Mesainiz sona erdi. Süre: **${embedDuration(duration)}**\n` +
        `Toplam Mesai Süreniz: **${embedDuration(updatedTotal)}**`
      )
      .setColor("Red")
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
});