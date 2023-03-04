const { EmbedBuilder } = require("discord.js");
const { client } = require("../index.js");
const moment = require("moment-timezone");

const day = [
  "星期天",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

Object.defineProperties(EmbedBuilder.prototype, {
  setConfig: {
    value: function (footer) {
      const text = [`今天是${day[moment().utcOffset(8).weekday()]}`];
      if (footer === undefined)
        footer = text[Math.floor(Math.random() * text.length)];
      return this.setColor(parseInt("FFD9EC", 16)).setFooter({
        text: footer,
        iconURL: client.user.displayAvatarURL(),
      });
    },
    enumerable: false,
  },
  addField: {
    value: function (name, value, inline = false) {
      return this.addFields({
        name,
        value,
        inline,
      });
    },
    enumerable: false,
  },
});
