// MIT License
// Copyright (c) 2022 Sujaykumar Hublikar <hello@sujaykumarh.com>

// const utils = require("../../utils");
// const inquirer = require("inquirer");
const Gauge = require("gauge");

// const subCmd = require("./subcmd");

// USAGE: test <TYPE> [options]

module.exports = {
  command: null,
  init: function (pgm) {
    // utils.inquirerInit(inquirer);

    this.command = pgm
      .command("test", {hidden: true})
      .description("test DESCRIPTION");
      
    // utils.addDefaultOpts(this.command);
    var progressbar = new Gauge();

    this.command
      .action(() => {
        console.log("command ran");
        progressbar.show("working…", 0);
        setTimeout(() => { progressbar.pulse(); progressbar.show("working…", 0.25); }, 500);
        setTimeout(() => { progressbar.pulse(); progressbar.show("working…", 0.50); }, 1000);
        setTimeout(() => { progressbar.pulse(); progressbar.show("working…", 0.75); }, 1500);
        setTimeout(() => { progressbar.pulse(); progressbar.show("working…", 0.99); }, 2000);
        setTimeout(() => progressbar.hide(), 2300);
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
