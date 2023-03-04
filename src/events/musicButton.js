const { client } = require("../index.js");
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Player } = require("discord-player");
const player = Player.singleton(client, {
  queryCache: null,
  ytdlOptions: {
    requestOptions: {
      headers: {
        cookie: process.env.COOKIE,
      },
    },
  },
});
const { QueueRepeatMode } = require("discord-player");
const { i18nMixin, tl3 } = require("../utils/i18n.js");
const { getComponent } = require("../utils/components.js");
const db = require("croxydb");

db.setReadable(true);
const { pause, resume, previous, stop, skip, loop, loopt, loopq, refresh } =
  getComponent();

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (!interaction.customId.startsWith("music_")) return;
    await interaction.deferUpdate().catch(() => {});
    const tr = i18nMixin(tl3(interaction.locale) || "en");
    if (!interaction.member.voice.channel)
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `<@${interaction.user.id}> ` + tr("music_NotinChannel")
            ),
        ],
        ephemeral: true,
      });

    if (
      interaction.guild.members.me.voice.channel &&
      interaction.guild.members.me.voice.channelId !=
        interaction.member.voice.channelId
    )
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `<@${interaction.user.id}> ` + tr("music_NotSameChannel")
            ),
        ],
        ephemeral: true,
      });

    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying())
      return interaction.message?.edit({
        embeds: [
          new EmbedBuilder().setConfig().setDescription(tr("music_NoMusic")),
        ],
        components: [],
      });

    if (
      db.has(`${interaction.guild.id}.DJ`) &&
      interaction.customId != "music_refresh"
    ) {
      const dj = db.get(`${interaction.guild.id}.DJ`);
      if (!interaction.member.roles.cache.has(dj))
        return interaction.followUp({
          embeds: [
            new EmbedBuilder().setConfig().setDescription(
              tr("music_NoDJRole", {
                z: `<@&${dj}>`,
              })
            ),
          ],
          ephemeral: true,
        });
    }

    if (interaction.customId === "music_pause") queue.node.setPaused(true);
    if (interaction.customId === "music_resume") queue.node.setPaused(false);
    if (interaction.customId === "music_previous") {
      if (!queue.history.tracks.at(0))
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_NonPrevious")}`
              ),
          ],
          ephemeral: true,
        });
      queue.history.previous();
    }
    if (interaction.customId === "music_skip") queue.node.skip();
    if (interaction.customId === "music_stop") queue.delete();
    if (interaction.customId === "music_loopN")
      queue.setRepeatMode(QueueRepeatMode.TRACK);
    if (interaction.customId === "music_loopT")
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
    if (interaction.customId === "music_loopQ")
      queue.setRepeatMode(QueueRepeatMode.OFF);
    var row = new ActionRowBuilder();
    if (queue.repeatMode === 0)
      queue.node.isPaused()
        ? row.addComponents(resume, previous, stop, skip, loop)
        : row.addComponents(pause, previous, stop, skip, loop);
    else if (queue.repeatMode === 1)
      queue.node.isPaused()
        ? row.addComponents(resume, previous, stop, skip, loopt)
        : row.addComponents(pause, previous, stop, skip, loopt);
    else if (queue.repeatMode === 2)
      queue.node.isPaused()
        ? row.addComponents(resume, previous, stop, skip, loopq)
        : row.addComponents(pause, previous, stop, skip, loopq);
    var row2 = new ActionRowBuilder().addComponents(refresh);
    if (interaction.customId != "music_stop")
      return interaction.message?.edit({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setTitle(queue.currentTrack.title)
            .setURL(queue.currentTrack.url)
            .setImage(queue.currentTrack.thumbnail)
            .setDescription(queue.node.createProgressBar()),
        ],
        components: [row, row2],
      });
  }
});
