//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const os = require("os")
const fs = require("fs")
const cpy = require("cpy")
const path = require("path")
const chalk = require("chalk")
const makeDir = require("make-dir")

const { install } = require("./Helpers/Install")
const { isYarnInstalled } = require("./Helpers/Yarn")
const { isFolderEmpty } = require("./Helpers/FileSystem")
const { tryToInitializeGitRepo } = require("./Helpers/Git")
const { isGithubUrl, isValidUrl } = require("./Helpers/URL")
const { getRepoInfo, isRepoOk, repoHasExample, downloadAndExtractRepo } = require("./Helpers/Examples")

/**
 * Function to create the Bon Ui application using a specified template
 * @param {Object} options
 * @param {String} options.appPath      Path to the project root
 * @param {Boolean} options.useNpm
 * @param {String} [options.template]   Template to use for creating an app (URL to Github repo or the name of one of default templates)
 */
exports.createApp = async function ({ appPath, useNpm, template = "default" }) {
    console.log()

    let repoInfo

    if (isGithubUrl(template)) {
        let url = new URL(template)
        repoInfo = await getRepoInfo(url)
    } else if (isValidUrl(template)) {

        console.error(`Invalid URL: ${chalk.red(
            `"${template}"`
        )}. Only Github repositories are supported. Please use a Github URL and try again.`)
        process.exit(1)

    } else if (template === "default") {
        repoInfo = null
    } else {
        const foundExample = await repoHasExample(template)
        if (!foundExample) {
            console.error(`Could not locate an example named ${chalk.red(
                `"${template}"`
            )}. Please check your spelling and try again`)
            process.exit(1)
        }

        repoInfo = await getRepoInfo(new URL(`https://github.com/teplovs/bon-ui/tree/master/Examples/${template}`))
    }

    // Note: appPath is already resolved in the App.js file
    // but this function is exported, so we are resolving the path 
    // again to be sure that it is resolved
    const root = path.resolve(appPath)
    const appName = path.basename(appPath)
    const useYarn = !useNpm && isYarnInstalled()
    const command = useYarn ? "yarn" : "npm"

    await makeDir(appPath)

    if (!isFolderEmpty(appPath)) {
        console.error(`The folder "${chalk.red(appPath)}" is not empty!`)
        process.exit(1)
    }

    console.log(`Creating a new Bon UI app in ${chalk.yellow(root)}.`)
    console.log()

    process.chdir(root)

    if (repoInfo) {
        console.log(`Downloading and extracting files from ${
            template.startsWith("https://github.com") ? "repo": "example"
        } ${chalk.yellow(template)}. This might take a moment.`)
        console.log()

        await downloadAndExtractRepo(root, repoInfo)

        console.log("Installing dependencies. This might take a couple of minutes")
        console.log()

        await install(root, null, { useYarn })
        console.log()
    } else {
        const packageJson = {
            name: appName,
            version: "0.1.0",
            private: true,
            scripts: {
                dev: "bon-ui dev",
                build: "bon-ui build",
                start: "bon-ui start"
            }
        }

        fs.writeFileSync(
            path.join(root, "package.json"), 
            JSON.stringify(packageJson, null, 4) + os.EOL
        )

        console.log(`Installing ${chalk.yellow("bon-ui")}...`)
        console.log()

        await install(root, [ "@teplovs/bon-ui" ], { useYarn })
        console.log()

        await cpy("**", root, {
            cwd: path.join(__dirname, "Templates", "default"),
            parents: true,
            rename: filename => {
                switch (filename) {
                    case "gitignore":
                        return ".gitignore"
                    default:
                        return filename
                }
            }
        })
    }

    if (tryToInitializeGitRepo()) {
        console.log(`Initialized git repository.`)
        console.log()
    }

    console.log(`${chalk.green.bold("Success!!!")} Created ${appName} at ${appPath}`)
    console.log("Inside that directory, you can run several scripts:")
    console.log()
    console.log(chalk.yellow(`${command} ${useYarn ? "" : "run "}dev`))
    console.log("    Starts the development server for your app.")
    console.log()
    console.log(chalk.yellow(`${command} start`))
    console.log("    Runs the build app in production mode.")
    console.log()
    console.log(chalk.yellow(`${command} ${useYarn ? "" : "run "}build`))
    console.log("    Builds your app for production.")
    console.log()
    console.log(chalk.yellow.bold("Happy hacking!"))
}

