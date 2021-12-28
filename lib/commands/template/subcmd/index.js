// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: COMMAND SUBCOMMAND <TYPE> [options]
// const utils = require("../../../utils");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd
      .command("SUBCOMMAND")
      .description("SUBCOMMAND DESCRIPTION")
      .action(() => {
        console.log("SUBCOMMAND");
      });

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
