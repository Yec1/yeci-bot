const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription(
      "Encountered a bug or want to offer a suggestion? Use this command!"
    )
    .setNameLocalizations({
      "zh-TW": "協助",
    })
    .setDescriptionLocalizations({
      "zh-TW": "遇到錯誤或想提供建議? 使用這個命令!",
    }),

  async execute(client, interaction, args, tr, emoji) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setConfig()
          .setDescription(`${emoji.verify} ${tr("support")}`),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(tr("support_server"))
            .setURL("https://discord.gg/mPCEATJDve")
            .setStyle(5)
        ),
      ],
    });
  },
};
