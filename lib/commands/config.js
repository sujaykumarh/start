// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: config <TYPE> [options]
const utils = require("../utils");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd
      .command("config")
      .description(utils.APP_NAME + " default config");

    this.setupList();
    this.setupInit();
  },
  setupList: function () {
    this.commander
      .command("list")
      .description("list all default configs")
      .action(() => {
        console.log("list all default configs");
      });
  },
  setupInit: function () {
    this.commander
      .command("init")
      .description("initilize default config")
      .action(() => {
        console.log("initilize default config");
      });
  },
};
