const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("../db.js");

const DEPARTMENTS = {
  gtf: "Gang Unit",
  lspd: "Los Santos Police Department",
  doj: "Los Santos Department of Justice",
  ems: "Los Santos Emergency Medical Services",
  sasp: "San Andreas State Police",
  sapr: "San Andreas Park Rangers",
  vpd: "Vespucci Police Department",
  pbso: "Paleto Bay Police Department",
  bcso: "Blaine County Sheriff's Office",
  usms: "United States Marshals Service",
};

module.exports = {
  name: "mesai-sistemi-kur",
  description: "FiveM RP Departmanınız için mesai sistemi kurarsınız.",
  options: [
    {
      name: "departman",
      description: "Departmanınızı seçiniz.",
      type: 3,
      choices: Object.entries(DEPARTMENTS).map(([value, name]) => ({ name, value })),
      required: true,
    },
    {
      name: "kanal",
      description: "Mesai sisteminin çalışacağı kanalı seçiniz.",
      type: 7,
      required: true,
      channel_types: [0],
    },
  ],

  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const department = interaction.options.getString("departman");
    const channel = interaction.options.getChannel("kanal");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "Bu komutu kullanmak için yeterli yetkiniz yok.", ephemeral: true });
    }

    db.set(`mesai-${interaction.guild.id}`, {
      department,
      channel: channel.id,
    });

    const buttons = createButtons(interaction.guild.id);
    const embed = createEmbed(
      `${DEPARTMENTS[department]} | Mesai Sistemi`,
      `${interaction.user.username} tarafından ayarlandı. Aşağıdaki butona basarak mesai girişinizi yapabilirsiniz.`,
      `Eğer mesainizi açık bırakırsanız ve bu tespit edilirse yönetmenliğe göre ceza alırsınız.`
    );

    embed.setImage("https://i.imgur.com/xOt0TdU.gif")

    channel.send({ embeds: [embed], components: [buttons] });

    interaction.reply({
      embeds: [
        createEmbed(
          "Mesai Sistemi Kuruldu",
          `Mesai sistemi başarıyla **${channel.name}** kanalında aktif edildi.`
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

function createButtons(guildId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`mesai-${guildId}-basla`)
      .setLabel("Mesai Girişi")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`mesai-${guildId}-bitir`)
      .setLabel("Mesai Çıkışı")
      .setStyle(ButtonStyle.Danger)
  );
}