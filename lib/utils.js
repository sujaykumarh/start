// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

const child_process = require("child_process");
const package_json = require("../package.json");
const spinnerjs = require("./helpers/spinner");
const fs = require("fs");
var https = require("https");

var VERBOSE = false;
var VERBOSE_EXTRA = false;
var spinner = spinnerjs.Spinner;

const utils = {
  verbose: false,
  isVerbose: () => VERBOSE,
  isVerboseExtra: () => VERBOSE_EXTRA,

  HEADERS: {
    append: `\n\n## ++++++++ Appended by ${package_json.name} ++++++++ ##\n\n`,
    created: `## .gitignore file is Created by ${package_json.name} v${package_json.version} \n## Source ${package_json.homepage} \n\n`,
  },
  addHeaders: true,

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
  APP_VERSION: package_json.version,
  APP_NAME: package_json.name,

  USER_AGENT: `${package_json.name} - node app`,

  log: function (message, ...optionalParams) {
    if (VERBOSE) console.log(message, ...optionalParams);
  },
  logExtra: function (message, ...optionalParams) {
    if (VERBOSE_EXTRA) console.log(message, ...optionalParams);
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
    cmdOut = "";
    try {
      let options = { stdio: "pipe" };
      cmdOut = child_process.execSync(command, options);
    } catch (e) {
      if (VERBOSE) console.error(e);
      return "";
    }
    return cmdOut.toString().replace(/[\n\r]/g, "");
  },

  defaultConfig: undefined,
  getConfig: function (key) {
    if (!utils.defaultConfig) return;
    if (!key) return;
  },
  gitConfig: function (key) {
    if (!key) return;

    const command = `git config --global --get ${key}`;
    return utils.execute(command, (output) => {
      return output;
    });
  },

  getGitAuthor: function () {
    return `${utils.gitConfig("user.name")} <${utils.gitConfig("user.email")}>`;
  },
  updateUtils: (options) => {
    VERBOSE = options.verbose;
    VERBOSE_EXTRA = options.Vv;
    utils.logExtra("options", options);
  },
  addDefaultOpts: function (cmd) {
    cmd
      .option("-v, --verbose", "verbose output", false)
      .option("-vv", "extra verbose output", false)
      .option("-p, --profile", "use profile form config");

    return cmd;
  },

  sleep: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  writeToFile: function (file, content, callback) {
    // fs.writeFileSync(file, content);
    fs.writeFile(file, content, (err) => {
      if (err) throw err;
      if (callback) callback();
    });
  },

  inquirerInit: function (inquirer) {
    if (!inquirer) return;

    // register inquirer plugins.
    // plugin list: https://github.com/SBoudrias/Inquirer.js#plugins

    inquirer.registerPrompt(
      "autocomplete",
      require("inquirer-autocomplete-prompt")
    );
    inquirer.registerPrompt("search-list", require("inquirer-search-list"));
    inquirer.registerPrompt(
      "checkbox-plus",
      require("inquirer-checkbox-plus-prompt")
    );
    inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));
  },

  // get from url
  getFromUrl: async function (url, returndata) {
    return new Promise((resolve, reject) => {
      utils.log("getting data from url: ", url);
      https
        .get(
          url,
          {
            headers: { "User-Agent": utils.USER_AGENT },
          },
          (res) => {
            if (res.statusCode !== 200) {
              var err = new Error("somethingWentWrong");
              err.statusCode = res.statusCode;
              reject(err);
            }

            var body = "";
            res.on("data", function (chunk) {
              body += chunk;
            });
            res.on("end", function () {
              utils.logExtra('body: ', body);
              resolve({
                body: body,
                status: res.statusCode,

                returndata: returndata,
              });
            });
          }
        )
        .on("error", (e) => {
          reject(e);
        });
    });
  },
};

module.exports = utils;
