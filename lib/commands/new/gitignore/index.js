// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

// USAGE: new gitignore <TYPE> [options]
const utils = require("../../../utils");

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const fuzzy = require("fuzzy");
var https = require("https");

module.exports = {
  fileInfo: {
    name: ".gitignore",
    path: "",
    overwrite: true,
    addHeader: true,
  },

  command: null,
  init: function (cmd) {
    utils.inquirerInit(inquirer);

    this.command = cmd
      .command("gitignore")
      .alias("gi")
      .description("create / update .gitignore files");

    this.command.option(
      "--noheader",
      "Do not add header to the gitignore file",
      false
    );
    // .option("-l, --list", "list simple list of all available gitignore types", false)

    utils.addDefaultOpts(this.command);

    var thiscmd = this;
    this.command.action(() => {
      utils.updateUtils(thiscmd.command.opts());
      thiscmd.showPrompt();
    });
  },

  showPrompt: function () {
    // utils.logExtra("gitignore");

    inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "type of gitignore file.",
          choices: ["default", "everything except .gitignore", "from github"],
          default: "default", 
          // default: "from github", // for testing
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
          default: "./",
          // default: "./tmp", // for testing
        },
        {
          type: "list",
          name: "operation",
          message: "type of file operation to perform? if file exists",
          choices: ["overwrite", "append"],
          default: "overwrite",
        },
      ])
      .then((answers) => {
        this.fileInfo.name = answers.filename;
        this.fileInfo.path = answers.path;
        this.fileInfo.overwrite = answers.operation === "overwrite";

        if (answers.type === "from github") {
          console.log("from github");
          this.promptGithub();
        } else {
          utils.log(answers);

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

          console.log("");
          inquirer
            .prompt([
              {
                type: "list",
                name: "confirm",
                choices: ["Yes", "No"],
                message: `Are you sure you want to Proceed?`,
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
              var file = `${this.fileInfo.path}/${this.fileInfo.name}`;
              var fromFile = path.resolve(
                __dirname + "/files/" + gitingoreFile
              );
              var MSG = "";

              utils.spinner.start(`Creating ${this.fileInfo.name}`);
              var contents = fs.readFileSync(fromFile, "utf8");
              if (fs.existsSync(file) && !this.fileInfo.overwrite) {
                if (this.fileInfo.addHeader)
                  contents = utils.HEADERS.append + contents;
                fs.appendFileSync(file, contents);

                MSG = `✅ Appended '${answers.type}' to ${file}`;
              } else {
                if (this.fileInfo.addHeader)
                  contents = utils.HEADERS.created + contents;
                fs.writeFileSync(file, contents);

                MSG = `✅ Created .gitignore file of type '${answers.type}' in ${this.fileInfo.path}`;
              }

              utils.spinner.stop(MSG);
              utils.exit();
            });
        }
      });
  },

  processGitignoreFiles: function (files) {
    var giTypes = [];
    files.forEach((file) => {
      giTypes.push(file.name);
    });

    inquirer
      .prompt([
        {
          type: "checkbox-plus",
          name: "gi",
          message: "select gitignore file.",
          choices: giTypes,
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
        var giToCreate = a.gi;
        if (giToCreate.length) {


          console.log("");
          inquirer
            .prompt([
              {
                type: "list",
                name: "confirm",
                choices: ["Yes", "No"],
                message: `Are you sure you want to Proceed?`,
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
              var file = `${this.fileInfo.path}/${this.fileInfo.name}`;

              var selected = [];
              giToCreate.forEach((gi) => {
                selected.push(files[giTypes.indexOf(gi)]);
              });
              utils.log('selected', selected);

              if(this.fileInfo.overwrite){
                // add header
                fs.writeFileSync(file, utils.HEADERS.created);
              }else{
                // add header
                fs.existsSync(file) ?
                fs.appendFileSync(file, utils.HEADERS.append) :
                fs.writeFileSync(file, utils.HEADERS.created);
              }
              
              // Append gitignore files list to file
              var content = `## merged github/gitignore file${(giToCreate.length) ? "'s" : ""} : ${giToCreate.join(', ')}\n`;
              content += `## Get the original file @ https://github.com/github/gitignore\n\n`;
              content = (!this.fileInfo.overwrite) ? "\n" + content : content;
              fs.appendFileSync(file, content);
                    

              // return
              utils.spinner.start('downloading gitignore content from github');

              var promises = [];

              // Download gitignore files
              for (var i = 0; i < selected.length; i++) {
                promises.push(selected[i].filename);
                // utils.spinner.text = `downloading ${selected[i].name}`;
                // console.log('downloading: ', item.download_url);
                utils.getFromUrl(selected[i].download_url, selected[i])
                .then((data) => {
                  var contents = data.body;
                  var item = data.returndata;
                  
                  promises.pop(item.filename);
                  
                  utils.spinner.text = `✅ downloaded ${item.filename} Applying`;
                  utils.log('downloaded: ', item.download_url);
                  // console.log(`writing ${item.filename} to ${file}`);
                  
                  // add filename header
                  contents = `## +++++++++ ${item.filename} +++++++++ \n${contents}\n`;
                  fs.appendFileSync(file, contents);
                  utils.spinner.text = `✅ ${item.filename} Applied to ${file}`;

                  // exit if end
                  if(promises.length < 1) {
                    utils.spinner.stop(`✅ ${file} created`);
                    // console.log(`✅ Completed writing ${selected.length} gitignore files from github to ${file}`);
                    utils.exit();
                  }
                }).catch((err) => {
                  utils.spinner.stop('Error Occured');
                  console.log(err);
                });
              }

          });
        }
      });
  },

  promptGithub: function (dir = "") {
    utils.spinner.start("Fetching from github");
    this.getGithubGitignoreTypes((err, files, dirs) => {
      if (err) {
        utils.spinner.stop("Error Occured");
        return utils.error(err);
      }
      utils.spinner.stop(`✅ Fetched ${files.length + dir.length} items\n`);

      if (dirs.length > 0) {
        var OPTIONS = ["gitignore file"];
        if (dirs.length > 0) {
          dirs.forEach((i) => {
            OPTIONS.push(`${i.name}--directory`);
          });
        }

        if (dir) console.log(`Slelect file from ${dir}`);

        inquirer
          .prompt([
            {
              type: "list",
              name: "type",
              message: "Select type",
              choices: OPTIONS,
              default: OPTIONS[0],
            },
          ])
          .then((answers) => {
            if (answers.type === OPTIONS[0]) {
              this.processGitignoreFiles(files);
            } else {
              var _dir_ = answers.type.split("--")[0];
              this.promptGithub(_dir_);
              // console.log(`dir : ${answers.type}`);
            }
          });
      } else {
        this.processGitignoreFiles(files);
      }
    }, dir);
  },

  // refrence: gitignore package
  getGithubGitignoreTypes: function (callback, dir = "") {
    var files = []; // .gitignore files
    var dirs = []; // directories with .gitignore files

    // get from dir if dir is not empty
    var _DIR = dir !== "" ? `/${dir}` : "";

    // ignore directories
    var IGNORE_DIRS = [
      ".github",
      ".git",
      "node_modules",
      "bower_components",
      "build",
      "dist",
      "tmp",
      "logs",
      "docs",
    ];

    // Fetches the list of files and directories in the given directory from GitHub gitignore repository using the API.
    https
      .get(
        {
          host: "api.github.com",
          path: "/repos/github/gitignore/contents" + _DIR,
          headers: { "User-Agent": utils.USER_AGENT },
        },
        function (res) {
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
            // utils.log(json);

            for (var i = 0; i < json.length; ++i) {
              var item = json[i];
              var name = item.name;
              var push_item = {};

              if (item.type === "dir") {
                if (IGNORE_DIRS.indexOf(name) === -1) {
                  push_item.name = name;
                  push_item.type = "dir";
                  push_item.link = item.url;
                  if (utils.isVerboseExtra()) push_item.item = item;

                  dirs.push(push_item);
                }
              } else {
                // get only files with .gitignore extension
                var cleanName = name.substr(0, name.indexOf("."));
                if (cleanName.length > 0 && name.match(/\.gitignore$/)) {
                  push_item.name = cleanName;
                  push_item.filename = name;
                  push_item.type = "file";
                  push_item.link = item.url;
                  push_item.download_url = item.download_url;
                  if (utils.isVerboseExtra()) push_item.item = item;

                  files.push(push_item);
                }
              }
            }
            callback(null, files, dirs);
          });
        }
      )
      .on("error", callback);
  },
};
