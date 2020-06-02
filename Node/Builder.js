//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const fs = require("fs")
const copy = require("cpy")
const path = require("path")
const util = require("util")
const BonUI = require("../")
const chalk = require("chalk")
const rimraf = require("rimraf")
const webpack = require("webpack")
const makeDir = require("make-dir")
const Helpers = require("./Helpers")
const chokidar = require("chokidar")
const childProcess = require("child_process")
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin")

const writeFile = util.promisify(fs.writeFile)
const _webpack = util.promisify(webpack)
const _rimraf = util.promisify(rimraf)

const defaultConfig = {
    appManager: "AppManager.js",
    env: { mode: process.env.NODE_ENV ? process.env.NODE_ENV : "production" },
    buildDirectory: ".build",
    buildPublicDirectory: "public",
    buildResourcesDirectory: "resources",
    resourcesDirectory: "Resources",
    bundleName: "bundle.mjs",
    builtServerName: "Server.mjs"
}

function clearPreviousLine () {
    process.stdout.moveCursor(0, -1)
    process.stdout.cursorTo(0)
    process.stdout.clearLine()
}

class Builder {
    constructor (options) {
        this.options = Object.assign(defaultConfig, options || {})
    }

    async buildProject ({ deleteBuildDirectory = true } = {}) {
        const appManagerPath = path.resolve(this.options.appManager)
        const resourcesDirectory = path.resolve(this.options.resourcesDirectory)

        if (!fs.existsSync(appManagerPath)) {
            throw new Error(`File ${chalk.red(this.options.appManager)} does not exist!`)
        }

        const buildDirectory = path.resolve(this.options.buildDirectory)
        const buildPublicDirectory = path.join(buildDirectory, this.options.buildPublicDirectory)
        const buildResourcesDirectory = path.join(buildPublicDirectory, this.options.buildResourcesDirectory)

        if (deleteBuildDirectory) {
            await _rimraf(buildDirectory)
        }

        await makeDir(buildDirectory)
        await makeDir(buildPublicDirectory)
        await makeDir(buildResourcesDirectory)

        const buildInfo = {
            onlyBundle: this.options.onlyBundle,
            server: Boolean(this.options.server),
            env: this.options.env
        }

        if (this.options.server) {
            buildInfo.serverFile = this.options.builtServerFile
        }

        await writeFile(path.join(buildDirectory, "BuildInfo.json"), JSON.stringify(buildInfo, null, 4) + "\n", "utf8")

        if (fs.existsSync(resourcesDirectory) && fs.statSync(resourcesDirectory).isDirectory()) {
            console.log(chalk.cyan("Copying resources to public directory..."))
            await copy([ resourcesDirectory.trimRight("/") + "/*.*" ], path.join(buildResourcesDirectory))
            clearPreviousLine()
            console.log(chalk.green("Resources copied successfully"))
        }

        console.log(chalk.cyan("Generating bundle..."))

        const BonUIProvidePlugin = {}
        for (let i in BonUI) {
            BonUIProvidePlugin[i] = [ "@teplovs/bon-ui", i ]
        }

        const HelpersProvidePlugin = {}
        const helpersPath = path.join(__dirname, "Helpers.js")
        for (let i in Helpers) {
            HelpersProvidePlugin[i] = [ helpersPath, i ]
        }

        const clientBuildStats = await _webpack({
            mode: this.options.env.mode,
            entry: appManagerPath,
            output: {
                library: "AppManager",
                libraryTarget: "var",
                path: buildPublicDirectory,
                filename: this.options.bundleName
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": this.options.env,
                    "BUILD_RESOURCES_PATH": `"${this.options.buildResourcesDirectory}"`
                }),
                this.options.server ? new EsmWebpackPlugin() : null,
                new webpack.ProvidePlugin(BonUIProvidePlugin),
                new webpack.ProvidePlugin(HelpersProvidePlugin)
            ].filter(n => n != null)
        })

        if (clientBuildStats.hasErrors()) {
            throw new Error(clientBuildStats.toString({ colors: true }))
        }

        clearPreviousLine()
        console.log(chalk.green("Bundle generated successfully"))

        if (this.options.onlyBundle) {
            return
        }

        const consoleTime = this.options.env.mode === "production" ? "" : 'console.time("App loading time")'
        const consoleTimeEnd = this.options.env.mode === "production" ? "" : 'console.timeEnd("App loading time")'

        const loadAppThen = this.options.env.mode === "production" ? "" : `
                    .then(() => {
                        console.log("App loaded successfully")
                        ${consoleTimeEnd}
                    })
        `.trim("\n")

        if (this.options.server) {
            console.log(chalk.cyan("Generating " + this.options.builtServerName))

            const serverContents = `
${this.options.env.mode === "production" ? `
import AppManager from "./${this.options.buildPublicDirectory.trim("/")}/${this.options.bundleName.trimLeft("/")}"
`.trim() : ""}
import Server from "@teplovs/bon-ui/server"
import path from "path"
import util from "util"
import url from "url"
import fs from "fs"

const readFile = util.promisify(fs.readFile)

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const publicPath = path.resolve(dirname, "./${this.options.buildPublicDirectory.trim("/")}")

const server = Server.createServer(async (request, response) => {
    try {
        process.stdout.write(\`\${request.method} - \${request.url} \`)

        const publicFilePath = path.join(publicPath, request.url)

        if (fs.existsSync(publicFilePath) && !fs.statSync(publicFilePath).isDirectory()) {
            const file = await readFile(publicFilePath)

            if (request.url === "/${this.options.bundleName}") {
                response.setHeader("Content-Type", "text/javascript")
            }

            response.writeHead(200)
            response.end(file, "utf8")
        } else {
${this.options.env.mode !== "production" ? `
            // used to not cache AppManager while development
            const { default: AppManager } = await import("./${this.options.buildPublicDirectory.trim("/")}/${this.options.bundleName.trimLeft("/")}?time=\${Date.now()}")
` : ""}
            const appManager = new AppManager({ path: request.url })
            const html = \`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        \${appManager.getHeadString()}
    </head>
    <body>
        <div id="root">\${appManager.getViewString()}</div>
        <script type="module">
            import AppManager from "/${this.options.bundleName}"
            const appManager = new AppManager({ path: location.pathname })
            ${consoleTime}
            window.addEventListener("load", () => {
                const result = appManager.loadApp({ node: document.querySelector("#root").childNodes[0] })
                if (result instanceof Promise) {
                    result
                        ${loadAppThen}
                        .catch(error => {
                            console.error("Could not load app")
                            console.error(error)
                        })
                } else {
                    console.error("AppManager#loadApp has to return promise")
                }
            })
        </script>${this.options.env.mode === "development" ? `
        <script src="/socket.io/socket.io.js"></script>
        <script>
            var socket = io("http://localhost:\${port}")
            socket.on("browserReload", () => {
                location.reload()
            })
        </script>
        ` : ""}
    </body>
</html>
\`
            response.writeHead(200)
            response.write(html, "utf8")
            response.end()
        }

        process.stdout.write(\`- status code \${response.statusCode} \\n\`)
    } catch (error) {
        response.writeHead(403)
        response.end()
        console.log()
        console.error(error)
    }
})

server.listen(port, () => {
    console.log(\`Server is listening on port \${port}\`)
})
`

            //throw new Error("Server generation is not implemented")
            //
            await writeFile(path.join(buildDirectory, this.options.builtServerName), serverContents)

            clearPreviousLine()
            console.log(chalk.green(this.options.builtServerName + " generated successfully"))
        } else {
            console.log(chalk.cyan("Generating index.html..."))
            const indexHtmlContents = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <script type="text/javascript" src="${this.options.bundleName}"></script>
        <script>
            (function () {
                const appManager = new AppManager.default()
                ${consoleTime}
                window.addEventListener("load", () => {
                    const result = appManager.loadApp()
                    if (result instanceof Promise) {
                        result
                            ${loadAppThen}
                            .catch(error => {
                                console.error("Could not load app")
                                console.error(error)
                            })
                    }
                })
            })()
        </script>
    </body>
</html>`.trim()
            await writeFile(path.join(buildPublicDirectory, "index.html"), indexHtmlContents + "\n", "utf8")
            clearPreviousLine()
            console.log(chalk.green("index.html generated successfully"))
        }
    }

    async runApp () {
        const buildDirectory = path.resolve(this.options.buildDirectory)
        const buildPublicDirectory = path.join(buildDirectory, this.options.buildPublicDirectory)
        const buildInfoPath = path.join(buildDirectory, "BuildInfo.json")
        const bundlePath = path.join(buildPublicDirectory, this.options.bundleName)

        if (!fs.existsSync(buildDirectory) || !fs.existsSync(buildPublicDirectory) || !fs.existsSync(buildInfoPath)) {
            throw new Error(`Please, ${chalk.red("rebuild")} the app. Not all needed files are present`)
        }

        const buildInfo = require(buildInfoPath)
        console.log("Build info", buildInfo)

        if (buildInfo.onlyBundle) {
            throw new Error(`Latest build has generated ${chalk.red("only bundle")}.`)
        }

        if (buildInfo.server) {
            const serverPath = path.join(buildDirectory, this.options.builtServerName)
            if (!fs.existsSync(serverPath)) {
                throw new Error(chalk.red(`File "${this.options.builtServerName}" is not found`))
            }

            const process = childProcess.fork(serverPath, {
                env: this.options.env
            })

            process.on("error", error => {
                throw error
            })

            process.on("exit", code => {
                if (code !== 0) {
                    throw new Error(chalk.red("Exit code - " + code))
                }
            })
        } else {
            throw new Error("Not implemented")
        }
    }

    async runDevServer () {
        return (
            this.buildProject({ server: true })
               .then(() => {
                   return this.runApp()
               })
        )
    }
}

exports.Builder = Builder

