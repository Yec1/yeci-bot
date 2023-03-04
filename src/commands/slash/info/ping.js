const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .setNameLocalizations({
      "zh-TW": "延遲",
    })
    .setDescriptionLocalizations({
      "zh-TW": "查看機器人延遲",
    }),

  async execute(client, interaction, args, tr) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setConfig().setDescription(
          tr("Ping_Msg", {
            ping: client.ws.ping,
            latency: Date.now() - interaction.createdTimestamp,
          })
        ),
      ],
    });
  },
};
