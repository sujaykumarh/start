// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new gitignore <TYPE> [options]
const utils = require("../../../utils");
const inquirer = require("inquirer");
const gi = require("gitignore");
const fs = require("fs");
const path = require("path");
const fuzzy = require("fuzzy");

module.exports = {
  commander: null,
  init: function (cmd) {
    utils.inquirerInit(inquirer);

    this.commander = cmd;

    gitignoreCmd = this.commander
      .command("gitignore")
      .description("create .gitignore file");
    // .argument("[type]", "type of gitignore file. e.g. node, git, etc.");

    gitignoreCmd.option(
      "-l, --list",
      "list simple list of all available gitignore types"
    );

    gitignoreOpts = utils.getOpts(gitignoreCmd);

    if (gitignoreOpts.list) {
      gi.getTypes((err, types) => {
        utils.log(types);
        if (err) return utils.error(err);
        console.log(types.join("\n"));
        utils.exit();
      });
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "type of gitignore file.",
          choices: ["default", "everything except .gitignore", "from github"],
          default: "node",
        },
        {
          type: "input",
          name: "filename",
          message: "filename of the gitignore file.",
          default: ".gitignore",
        },
        {
          type: "input",
          name: "path",
          message: "path to save .gitignore file",
          default: "./tmp",
        },
      ])
      .then((answers) => {
        if (answers.type === "from github") {
          var giTypes;

          utils.spinner.start("Fetching gitignore types");
          gi.getTypes((err, types) => {
            if (err) throw err;
            utils.spinner.stop(`Fetched ${types.length} gitignore types`);
            giTypes = types;

            // console.log(giTypes);
            // utils.exit();

            // show prompt for gitignore type
            inquirer
              .prompt([
                {
                  type: "checkbox-plus",
                  name: "giType",
                  message: "type of gitignore file from github/gitignore.",
                  // choices: giTypes,
                  // default: "",
                  pageSize: 10,
                  highlight: true,
                  searchable: true,
                  source: function (answersSoFar, input) {
                    input = input || "";

                    return new Promise(function (resolve) {
                      var fuzzyResult = fuzzy.filter(input, giTypes);

                      var data = fuzzyResult.map(function (element) {
                        return element.original;
                      });

                      resolve(data);
                    });
                  },
                },
              ])
              .then((a) => {
                // console.log(answers);
                if (a.giType.length === 0) {
                  utils.error(
                    "You need to select at least one gitignore type."
                  );
                  utils.exit();
                }
                // utils.spinner.start(`Creating ${answers.filename}`);
                // gi.getTemplates(answers.giType, (err, templates) => {
                //   if (err) return utils.error(err);
                //   utils.spinner.stop(`Created ${answers.filename}`);
                //   utils.log(templates);
                //   utils.exit();
                // });
              });
          });
        } else {
          utils.log(answers);

          utils.spinner.start(`Creating ${answers.filename}`);
          filename = "default.gitignore";

          switch (answers.type) {
            case "everything except .gitignore":
              // console.log("everything except .gitignore");
              filename = "except-self.gitignore";
              break;

            case "default":
            default:
              filename = "default.gitignore";
              break;
          }

          // console.log(__dirname);
          // console.log(process.cwd());
          fs.copyFileSync(
            path.resolve(__dirname + '/files/' + filename),
            `${answers.path}/${answers.filename}`
          );
          utils.spinner.stop(
            `✅ Created .gitignore file of type '${answers.type}' in ${answers.path}`
          );
          utils.exit();
        }
      });
  },
};
