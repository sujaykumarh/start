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
    this.commander = cmd.command("new").description("create new from template");

    licenseCmd.init(this.commander);
    gitignoreCmd.init(this.commander);
    projectCmd.init(this.commander);
    // this.setupProject();
    // this.setupGitignore();
    // this.setupLicense();
    // console.log("init new");
  },
  setupProject: function () {
    this.commander
      .command("project")
      .description("start a new project")
      .action(() => {
        console.log("new project");
      });
  },
  setupGitignore: function () {
    this.commander
      .command("gitignore")
      .description("create new gitignore file")
      .action(() => {
        console.log("new .gitignore file");
      });
  },
};
