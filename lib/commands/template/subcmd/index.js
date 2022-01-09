// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: COMMAND SUBCOMMAND <TYPE> [options]
// const utils = require("../../../utils");
// const inquirer = require("inquirer");

module.exports = {
  commander: null,
  init: function (cmd) {
    // utils.inquirerInit(inquirer);

    this.commander = cmd;
    subCmd = this.commander
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
