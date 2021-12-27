// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

const commander = require("commander");
const utils = require("./utils");

const commands = new commander.Command();
// const inquirer = require("inquirer");

// COMMANDS import
const newCmd = require("./commands/new");
const configCmd = require("./commands/config");

module.exports = {
  commander: commander,
  options: {},
  init: function () {
    // setup default options
    this.defaultCommands();

    // setup all commands
    this.setupCommands();

    // last parse to get the args
    this.parse();
  },
  defaultCommands: function () {
    commands
      .version(utils.APP_VERSION, "--version", "show version")
      .option("-v, --verbose", "print extra information", false);
  },
  parse: function () {
    commands.parse(process.argv);

    this.options = commands.opts();
    utils.verbose = this.options.verbose;
  },
  setupCommands: function () {
    // command to create new
    newCmd.init(commands);

    // command for app config
    configCmd.init(commands);

    // command to
    // .init(commands);
  },
};
