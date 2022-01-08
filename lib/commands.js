// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

const commanderjs = require("commander");
const utils = require("./utils");

const program = new commanderjs.Command();
// const inquirer = require("inquirer");

// COMMANDS import
const newCmd = require("./commands/new");
const configCmd = require("./commands/config");

module.exports = {
  options: {},
  init: function () {
    program
      .description(utils.package_json.description)
      .version(`v${utils.APP_VERSION}`, "--version", "show version")
      // .option("-v, --verbose", "print extra information", false);

      
    // utils.addDefaultOpts(program)
      
    // setup default options
    this.defaultCommands();
      
    // setup all commands
    this.addCommands();

    program.parse(process.argv);

    // last parse to get the args
    // this.parse();

    // console.log(program.opts());
    // program.parse()
  },
  defaultCommands: function () {

  },
  // parse: function () {
  //   commands.parse(process.argv);

  //   this.options = commands.opts();
  //   utils.verbose = this.options.verbose;
  // },
  addCommands: function () {
    // command to create new
    newCmd.init(program);
    
    // command for app config
    // configCmd.init(program);

    // command to
    // .init(program);
  },
};
