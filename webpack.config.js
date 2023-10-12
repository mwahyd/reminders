const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    script: path.resolve(__dirname, "src/script.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  //loaders
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(woff|woff2)$/i, type: "asset/resource" },
    ],
  },
  //plugins
  plugins: [
    new HtmlWebpackPlugin({
      title: "Reminders",
      filename: "index.html",
      template: path.resolve(__dirname, "src/template.html"),
    }),
  ],
};
