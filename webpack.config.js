console.log(__dirname, "~~~~~~~~~~"); //absolute path
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: `${BASE_JS}main.js`,
    videoPlayer: `${BASE_JS}videoPlayer.js`,
    recorder: `${BASE_JS}recorder.js`,
    commentSection: `${BASE_JS}commentSection.js`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  mode: "development",
  watch: true, // npm run assets 자동실행
  // clean: true, // build 전 output folder를 clean
  output: {
    filename: "js/[name].js",
    // path: "./assets/js",
    path: path.resolve(__dirname, "assets"),
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
        // use: ["style-loader", "css-loader", "sass-loader"], //webpack은 끝에서 시작
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //css파일을 따로 만들어 줌
      },
    ],
  },
};
