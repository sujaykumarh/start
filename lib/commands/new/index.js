// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new <TYPE> [options]
// const utils = require("../../utils");

const licenseCmd = require("./license");
const gitignoreCmd = require("./gitignore");
const projectCmd = require("./project");
const utils = require("../../utils");

module.exports = {
  command: null,
  init: function (pgm) {

    this.command = pgm
      .command('new')
      .description("create something from options")

    // utils.addDefaultOpts(this.command);

    
    licenseCmd.init(this.command);
    gitignoreCmd.init(this.command);
    // projectCmd.init(this.command);
    // console.log("init new");

    // this.command.command('test').alias('t').description("test").action(() => {
    //   console.log("test");
    //   console.log(this.command.opts());
    // });
  },
};
