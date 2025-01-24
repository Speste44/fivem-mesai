const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("../db.js");

module.exports = {
  name: "mesai-görüntüle",
  description: "Bir memurun toplam mesaisini görüntülersiniz.",
  options: [
    {
      name: "memur",
      description: "Mesai bilgisi görüntülenecek memuru seçiniz.",
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
      return interaction.reply({
        content: "Bu komutu kullanmak için yeterli yetkiniz yok.",
        ephemeral: true,
      });
    }

    if (!db.has(`mesai-${interaction.guild.id}`)) {
      return interaction.reply({
        content: "Bu sunucuda mesai sistemi kurulmamış.",
        ephemeral: true,
      });
    }

    if (!officer) {
      return interaction.reply({
        content: "Geçerli bir memur seçmelisiniz.",
        ephemeral: true,
      });
    }

    const totalShift = db.get(`toplam-mesai-${interaction.guild.id}-${officer.id}`) || 0;

    if (totalShift === 0) {
      return interaction.reply({
        content: `**${officer.user.username}** adlı memurun toplam mesai kaydı bulunmamaktadır.`,
        ephemeral: true,
      });
    }

    const formattedTime = formatTime(totalShift);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mesai Bilgisi")
          .setDescription(`**${officer.user.username}** adlı memurun toplam mesai süresi: **${formattedTime}**.`)
          .setColor("Green")
          .setThumbnail(officer.user.displayAvatarURL())
          .setTimestamp()
          .setFooter({ text: `Telif Hakkı ©️ 2025 | Raven Tüm Hakları Saklıdır.` }),
      ],
    });
  },
};

function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours} saat, ${minutes} dakika, ${seconds} saniye`;
}