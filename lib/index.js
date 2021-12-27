/*
MIT License
Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>
*/

// Import packages
const package_json = require('../package.json');
const commander = require("commander");
const inquirer = require("inquirer");
const cliSpinners = require("cli-spinners");

// Global constants
const DEFAULT_SPINNER = cliSpinners.dots2;
const APP_VERSION = package_json.version;
const APP_NAME = package_json.name;


// Global variables
const commands = new commander.Command();

class mySpinner {
  constructor(s) {
    this.spinner = s !== undefined ? s : DEFAULT_SPINNER;
    this.spinners = cliSpinners;
    this.frames = this.spinner.frames;
    this.interval = this.spinner.interval;
    this.i = 0;
    this.text = "";
  }

  setSpinner = (s) => {
    this.spinner = s !== undefined ? s : DEFAULT_SPINNER;
    this.frames = this.spinner.frames;
    this.interval = this.spinner.interval;
    this.i = 0;
  };

  start = (text) => {
    if (!this.ui)
      this.ui = new inquirer.ui.BottomBar({
        bottomBar: this.spinner.frames[this.i % this.spinner.frames.length],
      });

    this.text = text;
    if (!this.spinnerFun) {
      this.spinnerFun = setInterval(() => {
        this.ui.updateBottomBar(
          this.frames[this.i++ % this.frames.length] + " " + this.text
        );
      }, this.spinner.interval);
    }
  };

  stop = (text) => {
    this.text = text;
    this.ui.updateBottomBar(this.text);
    clearInterval(this.spinnerFun);
  };
}

// const loadingSpinner = new mySpinner();
// loadingSpinner.start("Loading....");
// setTimeout(() => {
//     loadingSpinner.stop("✅ Done\n")
//     finish()
// }, 5 * 1000);

// setup commands
function setupCommands() {
  commands
    .version(APP_VERSION, "--version", "show version")

  commands
    .option("-v, --verbose", "print extra information")

  // New Project Command
  newCmd = commands
    .command("new")
    .description("create new from template")

  newCmd
    .command("project")
    .description("start a new project")
    .action(() => {
      console.log("new project");
      finish();
    });

  newCmd
    .command("gitignore")
    .description("create new gitignore file")
    .argument("<type>")
    .action((type) => {
      console.log("new .gitignore file type:", type);
      finish();
    });

  newCmd
    .command("license")
    .description("create new LICENSE file")
    .argument("<type>")
    .action(() => {
      console.log("new LICENSE file type:", type);
      finish();
    });

  // newCmd
  //   .command("")


  // Configure the CLI
  configCmd = commands
    .command("config")
    .description(APP_NAME + " default config")

  configCmd
    .command("list")
    .description("list all default configs")
    .action(() => {
      console.log("list all default configs");
    });  
    
  configCmd
    .command("init")
    .description("initilize default config")
    .action(() => {
      console.log("initilize default config");
    });
}

// process args
function processArgs() {
  commands.parse(process.argv);

  const options = commands.opts();
  console.log("options:", options);
}

// main function
exports.main = function() {
  setupCommands();
  processArgs();
}

// finish
function finish() {
  process.exit();
}
