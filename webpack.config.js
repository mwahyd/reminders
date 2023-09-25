const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    script: path.require(__dirname, "src/script.js"),
  },
  output: {
    path: path.require(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
};
