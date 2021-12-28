// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new <TYPE> [options]
// const utils = require("../../utils");

const licenseCmd = require("./license");
const gitignoreCmd = require("./gitignore");
const projectCmd = require("./project");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd.command("new").description("create something new");

    licenseCmd.init(this.commander);
    gitignoreCmd.init(this.commander);
    projectCmd.init(this.commander);
    // console.log("init new");
  },
};
