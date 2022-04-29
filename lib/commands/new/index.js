// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new <TYPE> [options]

const licenseCmd = require("./license");
const gitignoreCmd = require("./gitignore");
// const projectCmd = require("./project");
const configFileCmd = require("./config");

// const utils = require("../../utils");
// const inquirer = require("inquirer");

module.exports = {
  command: null,
  init: function (pgm) {

    this.command = pgm
      .command("new")
      .description("create something from options");

    // utils.addDefaultOpts(this.command);

    
    licenseCmd.init(this.command);
    gitignoreCmd.init(this.command);
    // projectCmd.init(this.command);
    configFileCmd.init(this.command);
  },
};
