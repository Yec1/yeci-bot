const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { QueryType } = require("discord-player");
const load = require("lodash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Music commands")
    .setNameLocalizations({
      "zh-TW": "歌曲",
    })
    .setDescriptionLocalizations({
      "zh-TW": "歌曲指令",
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("Play the music!")
        .setNameLocalizations({
          "zh-TW": "播放",
        })
        .setDescriptionLocalizations({
          "zh-TW": "播放歌曲",
        })
        .addStringOption((string) =>
          string
            .setName("music")
            .setDescription("Input a song which you want to play")
            .setNameLocalizations({
              "zh-TW": "歌曲",
            })
            .setDescriptionLocalizations({
              "zh-TW": "請輸入你想播放的歌曲",
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stop")
        .setDescription("Stop the song!")
        .setNameLocalizations({
          "zh-TW": "停止",
        })
        .setDescriptionLocalizations({
          "zh-TW": "停止歌曲",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("shuffle")
        .setDescription("Shuffle the song!")
        .setNameLocalizations({
          "zh-TW": "洗牌",
        })
        .setDescriptionLocalizations({
          "zh-TW": "洗牌歌單內的歌曲",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("skip")
        .setDescription("Skip the music!")
        .setNameLocalizations({
          "zh-TW": "跳過",
        })
        .setDescriptionLocalizations({
          "zh-TW": "跳過當前歌曲",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("previous")
        .setDescription("Play previous music!")
        .setNameLocalizations({
          "zh-TW": "返回",
        })
        .setDescriptionLocalizations({
          "zh-TW": "播放前一首歌曲",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pause")
        .setDescription("Pause the music!")
        .setNameLocalizations({
          "zh-TW": "暫停",
        })
        .setDescriptionLocalizations({
          "zh-TW": "暫停當前歌曲",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("resume")
        .setDescription("Resume the music!")
        .setNameLocalizations({
          "zh-TW": "繼續",
        })
        .setDescriptionLocalizations({
          "zh-TW": "繼續當前歌曲",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Clear the queue!")
        .setNameLocalizations({
          "zh-TW": "清除",
        })
        .setDescriptionLocalizations({
          "zh-TW": "清除歌單",
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("Modify volume of song!")
        .setNameLocalizations({
          "zh-TW": "音量",
        })
        .setDescriptionLocalizations({
          "zh-TW": "調整歌曲的音量",
        })
        .addIntegerOption((Integer) =>
          Integer.setName("integer")
            .setDescription("Input a integer you want to modify the volume")
            .setNameLocalizations({
              "zh-TW": "整數",
            })
            .setDescriptionLocalizations({
              "zh-TW": "輸入你要修改音量的整數",
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription(
          "Remove a song at the specified position from the queue!"
        )
        .setNameLocalizations({
          "zh-TW": "移除",
        })
        .setDescriptionLocalizations({
          "zh-TW": "從歌單刪除指定位置的歌曲",
        })
        .addIntegerOption((Integer) =>
          Integer.setName("integer")
            .setDescription("Song position")
            .setNameLocalizations({
              "zh-TW": "整數",
            })
            .setDescriptionLocalizations({
              "zh-TW": "音樂的位置",
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("move")
        .setDescription("Moves a song to a different position in the queue!")
        .setNameLocalizations({
          "zh-TW": "移動",
        })
        .setDescriptionLocalizations({
          "zh-TW": "移動歌曲至歌單得其他位置",
        })
        .addIntegerOption((Integer) =>
          Integer.setName("oldposition")
            .setDescription("Input a position for the song you want to move")
            .setNameLocalizations({
              "zh-TW": "舊位置",
            })
            .setDescriptionLocalizations({
              "zh-TW": "輸入一個你想移動的音樂的位置",
            })
            .setRequired(true)
        )
        .addIntegerOption((Integer) =>
          Integer.setName("newposition")
            .setDescription("Input a position you want to move to")
            .setNameLocalizations({
              "zh-TW": "新位置",
            })
            .setDescriptionLocalizations({
              "zh-TW": "輸入一個你想移至的位置",
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("queue")
        .setDescription("List the music queue")
        .setNameLocalizations({
          "zh-TW": "隊列",
        })
        .setDescriptionLocalizations({
          "zh-TW": "查看歌曲播放列表",
        })
    ),

  async execute(client, interaction, args, tr, emoji, db, player) {
    const cmd = interaction.options.getSubcommand();

    if (!interaction.member.voice.channel)
      return interaction.reply({
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
      return interaction.reply({
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
    if (cmd != "play") {
      if (!queue?.isPlaying())
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ` + tr("music_NoMusic")
              ),
          ],
          ephemeral: true,
        });
      if (db.has(`${interaction.guild.id}.DJ`) && cmd != "queue") {
        const dj = db.get(`${interaction.guild.id}.DJ`);
        if (!interaction.member.roles.cache.has(dj))
          return interaction.reply({
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
    }
    if (cmd == "play") {
      const song = interaction.options.getString("music");
      const queue = await player.nodes.create(interaction.guildId, {
        leaveOnEnd: true,
        leaveOnStop: true,
        volume: 40,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 60 * 1000 * 3,
        bufferingTimeout: 200,
        spotifyBridge: true,
        deaf: true,
        ytdlOptions: {
          filter: "audioonly",
          fmt: "mp3",
          highWaterMark: 1 << 62,
          liveBuffer: 1 << 62,
          dlChunkSize: 0,
          bitrate: 128,
          quality: "lowestaudio",
        },
        metadata: interaction.channel,
      });

      const res = await player.search(song, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO,
      });

      if (!res || !res.tracks.length) {
        player.nodes.delete(interaction.guild);
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(`<@${interaction.user.id}> ` + tr("music_NoRes")),
          ],
          ephemeral: true,
        });
      }

      if (res.playlist) {
        if (!player.nodes.get(interaction.guild))
          return interaction.reply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setConfig()
                .setDescription(
                  `<@${interaction.user.id}> ` + tr("music_queueDestroy")
                ),
            ],
            components: [],
          });
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setTitle(
                `${tr(
                  queue.isPlaying() ? "music_AddToQueue" : "music_StartPlay"
                )}\n`
              )
              .setDescription(
                `[${res.playlist.title || "-"}](${res.playlist.url})`
              )
              .addField(
                tr("music_RequestBy"),
                `${emoji.line2} \`${res.playlist.tracks[0].requestedBy.username}\``,
                true
              )
              .addField(
                tr("music_Length"),
                `${emoji.line2} \`${res.playlist.tracks.length}\``,
                true
              )
              .setImage(res.playlist?.thumbnail.url),
          ],
        });
        queue.addTrack(res.tracks);
      } else {
        const menu = new StringSelectMenuBuilder()
          .setCustomId("music-menu")
          .setPlaceholder(tr("music_selectMusic"));
        res.tracks.slice(0, 10).forEach((track, i) => {
          let duration = track.duration;
          if (duration === "0:00") duration = `🔴 ${tr("live")}`;
          menu.addOptions({
            label: track.title.slice(0, 99) || "-",
            description: `${duration} - ${track.author}`,
            value: `music_c_${i + 1}`,
          });
        });
        const msg = await interaction.reply({
          content: `<@${interaction.member.id}>`,
          embeds: [
            new EmbedBuilder()
              .setConfig(tr("music_chooseFooter"))
              .setTitle(tr("music_choose")),
          ],
          components: [new ActionRowBuilder().addComponents(menu)],
        });
        try {
          const i = await msg.awaitMessageComponent({
            filter: (i) =>
              i.values[0].startsWith("music_c_") &&
              i.user.id === interaction.member.id,
            componentType: ComponentType.StringSelect,
            time: 15000,
          });
          if (!player.nodes.get(interaction.guild))
            return i.message?.edit({
              content: "",
              embeds: [
                new EmbedBuilder()
                  .setConfig()
                  .setDescription(
                    `<@${interaction.user.id}> ` + tr("music_queueDestroy")
                  ),
              ],
              components: [],
            });
          const n = parseInt(i.values[0].replace("music_c_", "")) - 1;
          let duration = res.tracks[n].duration;
          if (duration === "0:00") duration = `🔴 ${tr("live")}`;
          i.message?.edit({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setConfig()
                .setTitle(
                  `${tr(
                    queue.isPlaying() ? "music_AddToQueue" : "music_StartPlay"
                  )}\n`
                )
                .setDescription(
                  `[${res.tracks[n].title || "-"}](${res.tracks[n].url})`
                )
                .addField(
                  tr("music_RequestBy"),
                  `${emoji.line2} \`${res.tracks[n].requestedBy.username}\``,
                  true
                )
                .addField(
                  tr("music_Duration"),
                  `${emoji.line2} \`${duration}\``,
                  true
                )
                .setImage(res.tracks[n].thumbnail),
            ],
            components: [],
          });
          if (player.nodes.get(interaction.guild))
            queue.addTrack(res.tracks[n]);
        } catch (e) {
          if (!player.nodes.get(interaction.guild))
            return interaction.editReply({
              content: "",
              embeds: [
                new EmbedBuilder()
                  .setConfig()
                  .setDescription(
                    `<@${interaction.user.id}> ` + tr("music_queueDestroy")
                  ),
              ],
              components: [],
            });
          let duration = res.tracks[0].duration;
          if (duration === "0:00") duration = `🔴 ${tr("live")}`;
          interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setConfig()
                .setTitle(
                  `${tr("music_SelNonRes")} ${tr(
                    queue.isPlaying() ? "music_AddToQueue" : "music_StartPlay"
                  )}\n`
                )
                .setDescription(
                  `[${res.tracks[0].title || "-"}](${res.tracks[0].url})`
                )
                .addField(
                  tr("music_RequestBy"),
                  `${emoji.line2} \`${res.tracks[0].requestedBy.username}\``,
                  true
                )
                .addField(
                  tr("music_Duration"),
                  `${emoji.line2} \`${duration}\``,
                  true
                )
                .setImage(res.tracks[0].thumbnail),
            ],
            components: [],
          });
          if (player.nodes.get(interaction.guild))
            queue.addTrack(res.tracks[0]);
        }
      }
      try {
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel);
        if (!queue.isPlaying()) await queue.node.play();
      } catch (e) {
        console.log(e);
        player.nodes.delete(interaction.guild);
        return interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ` + tr("music_ConnectErr")
              ),
          ],
          components: [],
          ephemeral: true,
        });
      }
    }

    if (cmd == "stop") {
      queue.delete();
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(`<@${interaction.user.id}> ` + tr("music_stop")),
        ],
      });
    }

    if (cmd == "pause" || cmd == "resume") {
      queue.node.isPaused()
        ? queue.node.setPaused(false)
        : queue.node.setPaused(true);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `${
                queue.node.isPaused()
                  ? `<@${interaction.user.id}> ${tr("music_pause")}`
                  : `<@${interaction.user.id}> ${tr("music_resume")}`
              }`
            ),
        ],
      });
    }

    if (cmd == "shuffle") {
      if (!queue.tracks.at(0))
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_NonAfter")}`
              ),
          ],
          ephemeral: true,
        });
      queue.shuffle();
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(`<@${interaction.user.id}> ${tr("music_shuffle")}`),
        ],
      });
    }

    if (cmd == "previous") {
      if (!queue.history.tracks.at(0))
        return interaction.reply({
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
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `<@${interaction.user.id}> ${tr("music_previous")}`
            ),
        ],
      });
    }

    if (cmd == "skip") {
      queue.node.skip();
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(`<@${interaction.user.id}> ${tr("music_skip")}`),
        ],
      });
    }

    if (cmd == "volume") {
      const vol = interaction.options.getInteger("integer");
      if (!vol && vol != 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_NonVol")} ${
                  queue.node.volume
                }% / 200%`
              ),
          ],
          ephemeral: true,
        });
      if (vol < 0 || vol > 200)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_VolErr")}`
              ),
          ],
          ephemeral: true,
        });
      queue.node.setVolume(vol);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `<@${interaction.user.id}> ${tr("music_vol")} ${vol}%`
            ),
        ],
      });
    }

    if (cmd == "clear") {
      if (!queue.tracks.at(0))
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_NonAfter")}`
              ),
          ],
          ephemeral: true,
        });
      queue.tracks.clear();
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(`<@${interaction.user.id}> ${tr("music_clear")}`),
        ],
      });
    }

    if (cmd == "move") {
      const oldpos = interaction.options.getInteger("oldposition");
      const newpos = interaction.options.getInteger("newposition");
      const trackIndex = oldpos - 1;
      if (!queue.tracks.at(trackIndex))
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_MoveErr")}`
              ),
          ],
          ephemeral: true,
        });

      const track = queue.node.remove(trackIndex);
      queue.node.insert(track, newpos - 1);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `<@${interaction.user.id}> ${tr("music_move", {
                z: `[${track.title}](${track.url})`,
              })} ${newpos}`
            )
            .setThumbnail(track.thumbnail),
        ],
        ephemeral: true,
      });
    }

    if (cmd == "queue") {
      var page = 0;
      var mapping, pages, embed;
      function getEmbed() {
        const queue = player.nodes.get(interaction.guild);
        if (!queue || !queue.tracks.at(0)) {
          pages = 0;
          if (queue.currentTrack) {
            const track = queue.currentTrack;
            return (embed = new EmbedBuilder()
              .setConfig(`${tr("page")} ${page + 1}/1`)
              .setTitle("💿 " + track.title)
              .setURL(track.url)
              .setDescription(tr("music_queueNoSong"))
              .setThumbnail(
                interaction.guild.iconURL({
                  size: 4096,
                  dynamic: true,
                })
              ));
          }
          return (embed = new EmbedBuilder()
            .setConfig(`${tr("page")} ${page + 1}/1`)
            .setDescription(tr("music_queueNoSong"))
            .setThumbnail(
              interaction.guild.iconURL({
                size: 4096,
                dynamic: true,
              })
            ));
        }

        const tracks = queue.tracks.map(
          (track, i) =>
            `\`${i + 1}.\` \`[${
              track.duration == "0:00" ? `🔴 ${tr("live")}` : track.duration
            }]\` [${track.title}](${track.url}) - <@${track.requestedBy.id}>`
        );
        mapping = load.chunk(tracks, 10);
        pages = mapping.map((s) => s.join("\n"));
        const track = queue.currentTrack;
        return (embed = new EmbedBuilder()
          .setConfig(`${tr("page")} ${page + 1}/${pages.length}`)
          .setTitle("💿 " + track.title)
          .setURL(track.url)
          .setDescription(pages[page])
          .setThumbnail(
            interaction.guild.iconURL({
              size: 4096,
              dynamic: true,
            })
          ));
      }
      const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId("queue_back").setEmoji("⏮").setStyle(1),
        new ButtonBuilder()
          .setCustomId("queue_refresh")
          .setEmoji("🔄")
          .setStyle(2),
        new ButtonBuilder().setCustomId("queue_next").setEmoji("⏭").setStyle(1),
      ]);

      const resp = await interaction.reply({
        embeds: [getEmbed()],
        components: [row],
      });

      const filter = (i) => true;

      const collector = resp.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === "queue_next") {
          page = page + 1 < pages.length ? ++page : 0;
          return interaction.message?.edit({
            embeds: [getEmbed()],
            components: [row],
          });
        }
        if (interaction.customId === "queue_back") {
          page = page > 0 ? --page : pages.length - 1;
          return interaction.message?.edit({
            embeds: [getEmbed()],
            components: [row],
          });
        }
        if (interaction.customId === "queue_refresh") {
          return interaction.message?.edit({
            embeds: [getEmbed()],
            components: [row],
          });
        }
      });
    }

    if (cmd == "remove") {
      const pos = interaction.options.getInteger("integer");
      const tracks = queue.tracks.size;
      if (pos > tracks)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setConfig()
              .setDescription(
                `<@${interaction.user.id}> ${tr("music_RemoveErr")}`
              ),
          ],
          ephemeral: true,
        });

      const trackIndex = pos - 1;
      const track = queue.node.remove(trackIndex);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setConfig()
            .setDescription(
              `<@${interaction.user.id}> ${tr("music_remove")} [${
                track.title
              }](${track.url})`
            )
            .setThumbnail(track.thumbnail),
        ],
      });
    }
  },
};
