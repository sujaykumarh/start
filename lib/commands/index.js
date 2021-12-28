// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// import utils from "../utils";
// import inquirer from "inquirer";

//  Commands
import newCmd from "./commands/new";
// import configCmd from "./commands/config";

module.exports = {
    commander: null,
    init: function (cmd) {
        this.commander = cmd;

        newCmd.init(this.commander);
        // configCmd.init(this.commander);
    },
};