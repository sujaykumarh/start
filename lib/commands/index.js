// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// import utils from "../utils";
// import inquirer from "inquirer";

//  Commands
const newCmd = require("./new");
// const configCmd = require("./config");

const testCmd = require("./test");

module.exports = {
  program: null,
  init: function (pgm) {
    this.program = pgm;

    // Setup new sub-command
    newCmd.init(this.program);

    // Setup config sub-command
    // configCmd.init(this.program);

    // For testing
    testCmd.init(this.program);
  },
};