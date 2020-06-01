const fs = require("fs")
const path = require("path")
const util = require("util")
const chalk = require("chalk")
const webpack = require("webpack")
const makeDir = require("make-dir")
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin")

const writeFile = util.promisify(fs.writeFile)
const _webpack = util.promisify(webpack)

function clearPreviousLine () {
    process.stdout.moveCursor(0, -1)
    process.stdout.cursorTo(0)
    process.stdout.clearLine()
}

class Builder {
    constructor (options) {
        this.options = options
    }

    async buildProject () {
        console.log(this.options)
        const appManagerPath = path.resolve(this.options.appManager)
        const serverPath = this.options.server ? path.resolve(this.options.server) : null

        if (!fs.existsSync(appManagerPath)) {
            throw new Error(`File ${chalk.red(this.options.appManager)} does not exist!`)
        }

        const buildDirectory = path.resolve(this.options.buildDirectory)
        const publicDirectory = path.join(buildDirectory, this.options.publicDirectory)
        
        await makeDir(buildDirectory)
        await makeDir(publicDirectory)

        const buildInfo = {
            onlyBundle: this.options.onlyBundle,
            server: Boolean(this.options.server),
            env: this.options.env
        }

        await writeFile(path.join(buildDirectory, "BuildInfo.json"), JSON.stringify(buildInfo, null, 4) + "\n", "utf8")

        console.log(chalk.cyan("Generating bundle..."))

        const clientBuildStats = await _webpack({
            mode: this.options.env.mode,
            entry: appManagerPath,
            output: {
                library: "MyBonUIApp",
                libraryTarget: "var",
                path: publicDirectory,
                filename: this.options.bundleName
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": this.options.env
                }),
                new EsmWebpackPlugin(),
                new webpack.ProvidePlugin({
                    identifier: "@teplovs/bon-ui"
                })
            ]
        })

        if (clientBuildStats.hasErrors()) {
            throw new Error(clientBuildStats.toString({ colors: true }))
        }

        clearPreviousLine()
        console.log(chalk.green("Bundle generated successfully"))

        if (this.options.onlyBundle) {
            return
        }
    }
}

exports.Builder = Builder

