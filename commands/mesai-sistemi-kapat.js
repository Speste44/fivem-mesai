const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("../db.js");

module.exports = {
  name: "mesai-sistemi-kapat",
  description: "Mesai sisteminin çalışmasını durdurursunuz.",
  options: [],

  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "Bu komutu kullanmak için yeterli yetkiniz yok.", ephemeral: true });
    }

    if (!db.has(`mesai-${interaction.guild.id}`)) {
      return interaction.reply({ content: "Bu sunucuda mesai sistemi zaten kapalı.", ephemeral: true });
    }

    db.delete(`mesai-${interaction.guild.id}`);

    interaction.reply({
      embeds: [
        createEmbed(
          "Mesai Sistemi",
          `Mesai sistemi başarıyla kapandı.`
        ),
      ],
    });
  },
};

function createEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("Green")
    .setTimestamp()
    .setFooter({ text: `Telif Hakkı ©️ 2025 | Raven Tüm Hakları Saklıdır.` });
}