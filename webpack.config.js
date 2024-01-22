// from: https://www.codeinwp.com/blog/webpack-tutorial-for-beginners/#setting-up-a-project-to-be-bundled
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  mode: "development",
  output: { clean: true },
  devServer: { static: "./dist", open: true },
};
