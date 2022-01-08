// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new project <TYPE> [options]
const utils = require("../../../utils");
// const inquirer = require("inquirer");

module.exports = {
  commander: null,
  init: function (cmd) {
    // utils.inquirerInit(inquirer);
    
    this.commander = cmd
      .command("project").alias('p')
      .description("new project command")
      .action(() => {
        console.log("new project file");
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
