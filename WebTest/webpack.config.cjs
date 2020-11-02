//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

const path = require("path")

module.exports = {
  mode: process.env.NODE_ENV || "production",
  entry: "./App.js",
  output: {
    path: path.resolve(__dirname, ".build"),
    filename: "[name].js",
    // // the filename template for entry chunks
    // publicPath: "/assets/",
  },
  plugins: [new (require("html-webpack-plugin"))()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                decoratorsBeforeExport: false,
              },
            ],
            "@babel/plugin-proposal-class-properties",
          ],
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "Assets"),
    compress: true,
  },
}
