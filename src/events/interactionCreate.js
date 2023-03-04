const { client } = require("../index.js");
const { ApplicationCommandOptionType } = require("discord.js");
const { Player } = require("discord-player");
const { i18nMixin, tl3 } = require("../utils/i18n.js");
const emoji = require("../assets/emoji.js");
const db = require("croxydb");
db.setReadable(true);

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

client.on("interactionCreate", async (interaction) => {
  const i18n = i18nMixin(tl3(interaction.locale) || "en");
  if (interaction.isButton()) {
    await interaction.deferUpdate().catch(() => {});
  }
  if (interaction.isCommand()) {
    const command = client.commands.slash.get(interaction.commandName);
    if (!command) return;

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    try {
      command.execute(client, interaction, args, i18n, emoji, db, player);
    } catch (e) {
      console.log(e);
      interaction.reply({
        content: "好像出了一點小問題，請重試",
        ephemeral: true,
      });
    }
  } else if (interaction.isContextMenuCommand()) {
    const command = client.commands.slash.get(interaction.commandName);
    if (!command) return;

    try {
      command.execute(client, interaction);
    } catch (e) {
      console.log(e);
      interaction.reply({
        content: "好像出了一點小問題，請重試",
        ephemeral: true,
      });
    }
  }
});
