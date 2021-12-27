// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new <TYPE> [options]
const utils = require("../utils");

module.exports = {
  commander: null,
  init: function (cmd) {
    this.commander = cmd.command("new").description("create new from template");

    this.setupProject();
    this.setupGitignore();
    this.setupLicense();
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
  setupLicense: function () {
    this.commander
      .command("license")
      .description("create new LICENSE file")
      .action(() => {
        console.log("new LICENSE file");
      });
  },
};
