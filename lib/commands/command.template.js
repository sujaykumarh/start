// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: COMMAND <TYPE> [options]
const utils = require("../utils");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd
      .command("COMMAND")
      .description("COMMAND DESCRIPTION");

    // this.setupList();
  },
  setupList: function () {
    // this.commander
    //   .command("subcommand")
    //   .description("description")
    //   .action(() => {
    //     console.log("");
    //   });
  },
};
