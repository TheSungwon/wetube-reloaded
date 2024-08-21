console.log(__dirname, "~~~~~~~~~~"); //absolute path
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  output: {
    filename: "main.js",
    // path: "./assets/js",
    path: path.resolve(__dirname, "assets", "js"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"], //webpack은 끝에서 시작
      },
    ],
  },
};
