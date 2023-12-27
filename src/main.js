const dotenv = require("dotenv");
const { Collection } = require("discord.js");
const { client } = require("./index.js");
const { ClusterClient } = require("discord-hybrid-sharding");
dotenv.config();

client.cluster = new ClusterClient(client);
client.commands = {
  slash: new Collection(),
  message: new Collection(),
};

client.cluster.on("ready", async () => {
  require("./utils/inedx.js");
  require("./core/index.js")(client);
});

client.login(process.env.TOKEN);
