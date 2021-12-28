// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new project <TYPE> [options]
const utils = require("../../../utils");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd
      .command("project")
      .description("new project command")
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
