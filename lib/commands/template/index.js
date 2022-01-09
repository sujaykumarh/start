// MIT License
// Copyright (c) 2022 Sujaykumar Hublikar <hello@sujaykumarh.com>

// const utils = require("../../utils");
// const inquirer = require("inquirer");

// const subCmd = require("./subcmd");

// USAGE: cmd <TYPE> [options]

module.exports = {
  command: null,
  init: function (pgm) {
    // utils.inquirerInit(inquirer);

    this.command = pgm
      .command("cmd")
      .description("cmd DESCRIPTION");
      
    // utils.addDefaultOpts(this.command);

    this.command
      .action(() => {
        console.log("command ran");
      });

    // subCmd.init(this.command);
    // or 
    // this.addSubCmd();
  },
  addSubCmd: function () {
    this.command
      .command("subcmd")
      .description("description")
      .action(() => {
        console.log("");
      });
  },
};
