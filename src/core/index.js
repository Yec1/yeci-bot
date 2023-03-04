require("dotenv").config();
const { readdirSync } = require("fs");
const { ApplicationCommandType } = require("discord.js");

module.exports = async (client) => {
  // Slash Commands
  const data = [];
  readdirSync(`${process.cwd()}/src/commands/slash/`).forEach((dir) => {
    const slashCommandFile = readdirSync(
      `${process.cwd()}/src/commands/slash/${dir}/`
    ).filter((files) => files.endsWith(".js"));

    for (const file of slashCommandFile) {
      const slashCommand = require(`${process.cwd()}/src/commands/slash/${dir}/${file}`);

      if (!slashCommand.data.name) return;
      if (
        [ApplicationCommandType.Message, ApplicationCommandType.User].includes(
          slashCommand.type
        )
      )
        delete slashCommand.description;
      client.commands.slash.set(slashCommand.data.name, slashCommand);
      data.push(slashCommand.data);
    }
  });

  // Events
  const events = readdirSync(`${process.cwd()}/src/events/`).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of events) {
    require(`${process.cwd()}/src/events/${file}`);
  }

  console.log(`Loaded ${events.length} events, ${data.length} slashs`);

  // Slash Commands Register
  client.on("ready", async () => {
    await client.application.commands.set(data);
  });
};
