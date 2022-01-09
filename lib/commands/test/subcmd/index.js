// MIT License
// Copyright (c) 2022 Sujaykumar Hublikar <hello@sujaykumarh.com>

const utils = require("../../../utils");
// const inquirer = require("inquirer");


// USAGE: cmd subcmd <TYPE> [options]

module.exports = {
  command: null,
  init: function (pgm) {
    // utils.inquirerInit(inquirer);

    this.command = pgm
      .command("subcmd")
      .description("subcmd DESCRIPTION");
    // .alias("sc")
    // .argument("<TYPE>", "TYPE DESCRIPTION")

    // this.command
    //   .option("-o, --option", "Option DESCRIPTION")
      
    utils.addDefaultOpts(this.command);

    var thiscmd = this;
    this.command
      .action(() => {
        thiscmd.doSomething();
        console.log("subcmd ran");
      });
  },
  doSomething: function () {
    var cmdOpts = this.command.opts();
    utils.updateUtils(cmdOpts);

    console.log("doing something");
  },
};
