// const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDir(filePath){
    return path.resolve(".", filePath);
  },
};
