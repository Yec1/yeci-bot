const dotenv = require("dotenv");
const { ClusterManager, HeartbeatManager } = require("discord-hybrid-sharding");
dotenv.config();

const manager = new ClusterManager(`${process.cwd()}/src/index.js`, {
  totalShards: "auto",
  totalClusters: "auto",
  shardsPerClusters: 6,
  mode: "worker",
  token: process.env.TOKEN,
});

manager.extend(
  new HeartbeatManager({
    interval: 2000,
    maxMissedHeartbeats: 5,
  })
);

manager.on("clusterCreate", (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`)
);

manager.spawn({ timeout: -1 });
