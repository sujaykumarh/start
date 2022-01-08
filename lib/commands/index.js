// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// import utils from "../utils";
// import inquirer from "inquirer";

//  Commands
import newCmd from "./commands/new";
// import configCmd from "./commands/config";

module.exports = {
    program: null,
    init: function (pgm) {
        this.program = pgm;

        // Setup new sub-command
        newCmd.init(this.program);

        // Setup config sub-command
        // configCmd.init(this.program);
    },
};