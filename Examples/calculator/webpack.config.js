const path = require("path")

module.exports = {
    entry: "./Sources/AppManager.js",
    output: {
        path: path.resolve(__dirname, "./Distribution"),
        filename: "bundle.js"
    },
    optimization: {
        usedExports: true
    },
    devServer: {
        contentBase: path.join(__dirname, "./Distribution"),
        port: 9000
    }
}
