const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("../db.js");

module.exports = {
  name: "mesai-sıfırla",
  description: "Belirlenen memurun mesaisini sıfırlarsınız.",
  options: [
    {
      name: "memur",
      description: "Mesai sıfırlanacak memur seçiniz.",
      type: 6,
      required: true,
    },
  ],

  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    const officer = interaction.options.getMember("memur");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "Bu komutu kullanmak için yeterli yetkiniz yok.", ephemeral: true });
    }

    if (!db.has(`mesai-${interaction.guild.id}`)) {
      return interaction.reply({ content: "Bu sunucuda mesai sistemi kurulmamış.", ephemeral: true });
    }

    if (!db.has(`toplam-mesai-${interaction.guild.id}-${officer.id}`)) {
      return interaction.reply({ content: "Bu memurun mesaisini zaten yok..", ephemeral: true });
    }

    if (!officer) {
      return interaction.reply({
        content: "Geçerli bir memur seçmelisiniz.",
        ephemeral: true,
      });
    }

    db.delete(`toplam-mesai-${interaction.guild.id}-${officer.id}`);

    interaction.reply({
      embeds: [
        createEmbed(
          "Mesai Sıfırlama",
          `Mesai sistemi başarıyla **${officer.user.username}** memurunun mesaisini sıfırladı.`
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