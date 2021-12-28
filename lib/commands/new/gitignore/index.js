// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new gitignore <TYPE> [options]
const utils = require("../../../utils");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd
      .command("gitignore")
      .description("new gitignore file command")
      .action(() => {
        console.log("new .gitignore file");
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
