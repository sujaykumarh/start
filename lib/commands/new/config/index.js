// MIT License
// Copyright (c) 2022 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new config <TYPE> [options]
const utils = require("../../../utils");

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

module.exports = {
  fileInfo: {
    name: "",
    path: "",
    overwrite: true,
    addHeader: true,
  },

  command: null,
  init: function (cmd) {
    utils.inquirerInit(inquirer);

    this.command = cmd
      .command("config")
      .description("create config files");

    // this.command.option(
    //   "--noheader",
    //   "Do not add header to the gitignore file",
    //   false
    // );
    // .option("-l, --list", "list simple list of all available gitignore types", false)

    utils.addDefaultOpts(this.command);

    var thiscmd = this;
    this.command.action(() => {
      utils.updateUtils(thiscmd.command.opts());
      thiscmd.showPrompt();
    });
  },

  showPrompt: function () {
    inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "type of config file.",
          choices: [".editorconfig", ".gitattributes", ".npmignore"],
          default: "", 
        },
        {
          type: "input",
          name: "path",
          message: "path to save config file",
          default: "./",
          // default: "./tmp", // for testing
        },
      ])
      .then((answers) => {
        console.log("");
        inquirer
          .prompt([
            {
              type: "list",
              name: "confirm",
              choices: ["Yes", "No"],
              message: `Are you sure you want to create '${answers.type}' file? This will overwrite if file exists.`,
              default: "No",
              // default: "Yes", // for testing
            },
          ])
          .then((a) => {
            // Exit if user says no
            if (a.confirm === "No") {
              console.log("Operation Aborted");
              utils.exit();
            }

            // Continue if user says yes
            utils.log(answers);
            this.createConfigFile(answers);
          });
      });
  },
  createConfigFile: function (answers) {
    console.log("");
    var outFile = `${answers.path}`.toString();
    var _filename = `${answers.type}`.toString();

    if(_filename.startsWith(".")){
      _filename = _filename.substring(1);
    }

    const fromFile = path.resolve(
      path.resolve(__dirname) + "/files/" + _filename
    );

    _filename = `${answers.type}`.toString();

    utils.spinner.start(`Creating ${_filename}`);
    var contents = fs.readFileSync(fromFile, "utf8");

    if (outFile.endsWith("/")) {
      outFile = `${outFile}${_filename}`;
    }
    else {
      outFile = `${outFile}/${_filename}`;
    }

    fs.writeFileSync(outFile, contents);
    utils.spinner.stop(`Created ${outFile}`);
    utils.exit();
  },
};
