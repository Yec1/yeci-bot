const { client } = require("../index.js");
const { Player } = require("discord-player");
const { ActionRowBuilder, WebhookClient, EmbedBuilder } = require("discord.js");
const { getComponent } = require("../utils/components.js");
const moment = require("moment-timezone");
const webhook = new WebhookClient({ url: process.env.ERRWEBHOOK });
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
const { pause, resume, previous, stop, skip, loop, loopt, loopq, refresh } =
  getComponent();

player.events.on("debug", (_, message) => console.log(message));

player.events.on("emptyChannel", (queue) => {
  if (queue) player?.nodes.delete(queue.metadata);
});

player.events.on("error", (queue, error) => {
  console.log(error);
  if (queue?.metadata)
    queue.metadata.send({
      embeds: [new EmbedBuilder().setDescription("An error appeared!")],
    });
  webhook.send({
    embeds: [
      new EmbedBuilder().setDescription(
        `\`\`\`ini\n${moment()
          .tz("Asia/Taipei")
          .format("h:mm:ss a")}\nServer [ ${
          queue.guild.name
        } ] \n[ ${error} ]\n\`\`\``
      ),
    ],
  });
});

player.events.on("playerStart", async (queue, track) => {
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
  queue.metadata
    .send({
      embeds: [
        new EmbedBuilder()
          .setConfig()
          .setTitle(track.title)
          .setURL(track.url)
          .setImage(track.thumbnail)
          .setDescription(queue.node.createProgressBar()),
      ],
      components: [row, row2],
    })
    .then((msg) => {
      queue.npmessage = msg;
    });
});

player.events.on("playerFinish", async (queue, track) => {
  if (queue?.repeatMode == 1 && queue)
    if (queue?.npmessage && queue?.npmessage?.editable) {
      return queue.npmessage.delete();
    }
  if (queue?.npmessage && queue?.npmessage?.editable) {
    queue.npmessage.edit({
      components: [],
    });
  }
});
