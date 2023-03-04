const { ButtonBuilder } = require("discord.js");

function getComponent() {
  const pause = new ButtonBuilder()
    .setEmoji("⏸")
    .setCustomId("music_pause")
    .setStyle(3);
  const resume = new ButtonBuilder()
    .setEmoji("▶")
    .setCustomId("music_resume")
    .setStyle(3);
  const previous = new ButtonBuilder()
    .setEmoji("⏮")
    .setCustomId("music_previous")
    .setStyle(2);
  const stop = new ButtonBuilder()
    .setEmoji("⏹")
    .setCustomId("music_stop")
    .setStyle(4);
  const skip = new ButtonBuilder()
    .setEmoji("⏭")
    .setCustomId("music_skip")
    .setStyle(2);
  const loop = new ButtonBuilder()
    .setEmoji("❌")
    .setCustomId("music_loopN")
    .setStyle(3);
  const loopt = new ButtonBuilder()
    .setEmoji("🔂")
    .setCustomId("music_loopT")
    .setStyle(3);
  const loopq = new ButtonBuilder()
    .setEmoji("🔁")
    .setCustomId("music_loopQ")
    .setStyle(3);
  const refresh = new ButtonBuilder()
    .setEmoji("🔄")
    .setCustomId("music_refresh")
    .setStyle(1);

  return {
    pause,
    resume,
    previous,
    stop,
    skip,
    loop,
    loopt,
    loopq,
    refresh,
  };
}

module.exports = { getComponent };
