// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// license command script
const utils = require("../../../utils");
const inquirer = require("inquirer");

const spdxLicenseList = require("spdx-license-list/simple");
const spdxLicenseAll = require("spdx-license-list/full");

const SIMPLE_LICENSES = require("./spdx-simple");

// SPDX can be found here: https://spdx.org/licenses/
// SPDX example https://spdx.org/licenses/MIT.json
const SPDX_LICENSES = Array.from(spdxLicenseList);

// regex to replace everything beginning with a Copyright until newline or period
// REGEX: ^(Copyright)(.*\(c\))?(.*yyyy)?(.*year)?(.*ISC)?([^.\n]+)

// TODO: Fix Edge cases for the license
// Tested on: MIT, Apache-2.0, Unlinsense
const COPYRIGHT_REGEX =
  /^(Copyright)(.*\(c\))?(.*yyyy)?(.*year)?(.*ISC)?([^.\n]+)/gm;

module.exports = {
  command: null,
  init: function (cmd) {
    utils.inquirerInit(inquirer);

    this.command = cmd
      .command("license")
      .alias("li")
      .argument("[license-type]", "type of license. e.g. MIT")
      .description("create new LICENSE file");

    this.command
      .option("-l, --list", "list simple list of all available licenses")
      .option("-L, --list-all", "list all availalbe licenses", false)
      .option("-a, --all", "list all availalbe licenses in selection", false);

    utils.addDefaultOpts(this.command);

    var thiscmd = this;
    this.command.action((licenseType) => {
      // console.log('utils.verbose: ', utils.verbose);
      // console.log("licenseType: ", licenseType);
      thiscmd.showPrompt(licenseType);
    });
  },

  showPrompt: function (licenseType) {
    var licenseOpts = this.command.opts();
    utils.updateUtils(licenseOpts);
    // console.log('utils.verbose: ', utils.verbose);

    if (licenseOpts.listAll) {
      console.log(SPDX_LICENSES);
      SPDX_LICENSES.map(function (item) {
        console.log(item);
      });
      utils.exit();
    }

    if (licenseOpts.list) {
      console.log("simple list of all available licenses\n");
      console.log(SIMPLE_LICENSES.join("\n"));
      console.log("\nuse --list-all to see all available licenses");
      utils.exit();
    }

    // prompt for license type
    inquirer
      .prompt([
        {
          type: "list",
          name: "licenseType",
          message: "Select license type",
          choices: ["Open-Source", "Closed-Source"],
        },
        {
          type: "list",
          name: "license",
          message: "license name",
          default: licenseType || "MIT",
          choices: licenseOpts.all ? SPDX_LICENSES : SIMPLE_LICENSES,
          when: function (answers) {
            // Only run if user set a name
            return answers.licenseType !== "Closed-Source";
          },
        },
        {
          type: "input",
          name: "file",
          message: "file name",
          default: "LICENSE",
        },
        {
          type: "input",
          name: "author",
          message: "author",
          default: utils.getGitAuthor() || "",
        },
        {
          type: "input",
          name: "year",
          message: "copyright year",
          default: new Date().getFullYear(),
        },
        {
          type: "input",
          name: "path",
          message: "path to save LICENSE file",
          default: "./",
        },
      ])
      .then((answers) => {
        var _file = `${answers.path}`.toString();
        if (_file.endsWith("/")) {
          _file = `${_file}${answers.file}`;
        } else {
          _file = `${_file}/${answers.file}`;
        }

        console.log("");
        inquirer
          .prompt([
            {
              type: "list",
              name: "confirm",
              choices: ["Yes", "No"],
              message: `Are you sure you want to create '${_file}' file?`,
              default: "No",
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
            this.createLicense(answers);
          });
      });
  },
  createLicense: function (answers) {
    const logText = `${answers.license} license ${answers.path}/${answers.file}`;

    // console.log(spdxLicenseAll[answers.license]);

    utils.spinner.start(`Creating ${logText}`);

    const FILE = `${answers.path}/${answers.file}`;

    const copyright = `Copyright (c) ${answers.year} ${answers.author}`;
    var licenseTxt = "";

    switch (answers.licenseType) {
      case "Open-Source":
        licenseTxt = spdxLicenseAll[answers.license].licenseText.toString();
        licenseTxt = licenseTxt.replace(COPYRIGHT_REGEX, copyright);
        break;
      case "Closed-Source":
        licenseTxt = copyright;
        break;
      default:
        console.log("Invalid license type");
        utils.exit();
    }

    utils.writeToFile(
      FILE,
      licenseTxt.toString(),
      () => {
        utils.spinner.stop(`\n✅ Created ${logText}`);
        utils.exit();
      },
      (err) => {
        utils.spinner.stop(`\n❌ Failed to create ${logText}`);
        console.log(err);
        utils.exit(-1);
      }
    );
  },
};
