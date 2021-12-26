// Import packages
const package_json = require('../package.json');
const commander = require("commander");
const inquirer = require("inquirer");
const cliSpinners = require("cli-spinners");

// Global constants
const DEFAULT_SPINNER = cliSpinners.dots2;
const APP_VERSION = package_json.version;


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

const loadingSpinner = new mySpinner();
// loadingSpinner.start("Loading....");
// setTimeout(() => {
//     loadingSpinner.stop("✅ Done\n")
//     finish()
// }, 5 * 1000);

// setup commands
function setupCommands() {
  commands
    .version(APP_VERSION, "-v, --version", "show version")

  commands
    .option("-d, --debug", "output extra debugging")
    .option("-s, --small", "small pizza size");

  commands
    .command("new <name> [type]")
    .description("start a new project")
    .action((name, type) => {
      console.log("" + name + " starting a new project");
    });

  // commands
  //   .command("clone <source> [destination]")
  //   .description("clone a repository into a newly created directory")
  //   .action((source, destination) => {
  //     console.log("clone command called");
  //   });
}

// process args
function processArgs() {
  commands.parse(process.argv);

  const options = commands.opts();
  console.log("options:", options);
}

// main function
function main() {
  setupCommands();
  processArgs();
}

// finish
function finish() {
  console.log("completed!");
  process.exit();
}

main();
