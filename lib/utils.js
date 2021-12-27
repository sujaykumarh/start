// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

const package_json = require("../package.json");
const spinner = require("./spinner").Spinner;

module.exports = {
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
  exit: function (code) {
    process.exit(code);
  },
};
