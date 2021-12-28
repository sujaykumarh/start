// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

const child_process = require('child_process');
const package_json = require("../package.json");
const spinner = require("./helpers/spinner").Spinner;
const fs = require("fs");

module.exports = {
  ignorePaths: [
    "node_modules",
    "bower_components",
    "vendor",
    "dist",
    "build",
    "coverage",
    "test",
    "tests",
    ".git",
    "cache",
    ".cache",
    ".sass-cache",
    ".idea",
    ".vscode",
    ".vscode-test",
    "storage",
  ],
  spinner: spinner,
  package_json: package_json,
  verbose: false,
  APP_VERSION: package_json.version,
  APP_NAME: package_json.name,

  log: function (message, ...optionalParams) {
    if (this.verbose) console.log(message, ...optionalParams);
  },
  error: function (message, ...optionalParams) {
    console.error(message, ...optionalParams);
  },

  exit: function (code, message) {
    if (message) console.log(message);
    process.exit(code);
  },

  // execute a command and return the output only empty if it fails use -v to see the output
  execute: function (command, callback) {
    cmdOut = '';
    try{
      let options = { stdio : 'pipe' };
      cmdOut = child_process.execSync(command, options);
    }catch(e){
      if(this.verbose) console.error(e);
      return '';
    }
    return cmdOut.toString().replace(/[\n\r]/g, '');
  },

  defaultConfig: undefined,
  getConfig: function (key) {
    if(!this.defaultConfig) return;
    if(!key) return;
  },
  gitConfig: function(key){
    if(!key) return;

    const command = `git config --global --get ${key}`;
    return this.execute(command, (output) => {
      return output;
    });
  },

  getGitAuthor: function(){
    return `${this.gitConfig("user.name")} <${this.gitConfig("user.email")}>`
  },

  getOpts: function (cmd) {
    cmd
      .option("-v, --verbose", "verbose output")
      .option("-p, --profile", "use profile form config")

    options = cmd.opts();

    if(options.verbose) this.verbose = true;

    this.log(options);
    return options;
  },

  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));  
  },

  writeToFile: function(file, content, callback){
    // fs.writeFileSync(file, content);
    fs.writeFile(file, content, (err) => {
      if (err) throw err;
      if(callback) callback();
    });
  },

  inquirerInit: function(inquirer){
    if(!inquirer) return;

    // register inquirer plugins. 
    // plugin list: https://github.com/SBoudrias/Inquirer.js#plugins

    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
    inquirer.registerPrompt('search-list', require('inquirer-search-list'));
    inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
    inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))
  }
};
