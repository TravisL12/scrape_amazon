// from: https://www.codeinwp.com/blog/webpack-tutorial-for-beginners/#setting-up-a-project-to-be-bundled
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/index.html",
    }),
  ],
  mode: "development",
  output: { clean: true },
  devServer: { static: "./dist", open: true },
};
