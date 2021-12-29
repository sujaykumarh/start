// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new gitignore <TYPE> [options]
const utils = require("../../../utils");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const fuzzy = require("fuzzy");
var https = require('https');

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
          console.log("from github");
          utils.exit();

          // TODO: customize the .gitignore files from github
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
                utils.log(answers);
                utils.log(a);
                // console.log(answers);
                if (a.giType.length === 0) {
                  utils.error(
                    "You need to select at least one gitignore type."
                  );
                  utils.exit();
                }
                utils.spinner.start(`Creating ${answers.filename} in ${answers.path}`);

                const stream = fs.createWriteStream(`${answers.path}/${answers.filename}`);
                
                // a.giType.forEach(_ => {
                //   console.log(_);
                // });

                // giTypes.forEach(_ => {
                //   console.log(_);
                // });

                // console.log(stream);
                
                // utils.exit();
                gi.writeFile({
                  type: a.giType[0],
                  writable: stream,
                }, (err) => {
                  if (err) throw err;
                  utils.spinner.stop(`✅ Created ${answers.filename} in ${answers.path}`);
                  utils.exit();
                });
              });
          });
        } else {
          utils.log(answers);

          utils.spinner.start(`Creating ${answers.filename}`);


          var gitingoreFile = "default.gitignore";
          switch (answers.type) {
            case "everything except .gitignore":
              gitingoreFile = "except-self.gitignore";
              break;

            case "default":
            default:
              gitingoreFile = "default.gitignore";
              break;
          }

          // console.log(__dirname);
          // console.log(process.cwd());
          fs.copyFileSync(
            path.resolve(__dirname + '/files/' + gitingoreFile),
            `${answers.path}/${answers.filename}`
          );
          utils.spinner.stop(
            `✅ Created .gitignore file of type '${answers.type}' in ${answers.path}`
          );
          utils.exit();
        }
      });
  },

  // TODO: add directory option
  // TODO: add file option
  // refrence: gitignore package
  getGithubGitignoreTypes: function (dir='') {
    var types = [];
    https.get({ host: "api.github.com", path: "/repos/github/gitignore/contents", headers: { "User-Agent": "gitignore node app" } }, function (res) {
      if (res.statusCode !== 200) {
        var err = new Error("somethingWentWrong");
        err.statusCode = res.statusCode;
        return callback(err);
      }
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        var json = JSON.parse(body);
        for (var i = 0; i < json.length; ++i) {
          var name = json[i].name;
          var cleanName = name.substr(0, name.indexOf('.'));
          if (cleanName.length > 0 && name.match(/\.gitignore$/)) {
            types.push(cleanName);
          }
        }
        callback(null, types);
      });
    }).on("error", callback);
  },
};
