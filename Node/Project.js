//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const fs = require("fs")
const tar = require("tar")
const got = require("got")
const copy = require("cpy")
const util = require("util")
const path = require("path")
const chalk = require("chalk")
const { URL } = require("url")
const rimraf = require("rimraf")
const stream = require("stream")
const makeDir = require("make-dir")
const childProcess = require("child_process")
const loadingSpinner = require("loading-spinner")
const { clearPreviousLine } = require("./Console")

const _rimraf = util.promisify(rimraf)
const readDir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const pipeline = util.promisify(stream.pipeline)

function processExit(childProcess) {
    return new Promise((resolve, reject) => {
        childProcess.on("exit", code => {
            resolve(code)
        })
    })
}

async function isUrlOk (url) {
    const response = await got(url).catch(e => e)
    return response.statusCode === 200
}

function showSpinner () {
    loadingSpinner.start(100, {
        hideCursor: true
    })
}

class Project {
    constructor (info = {}) {
        this.name = info.name
        this.useNpm = info.useNpm || false
        this.template = info.template
    }

    async create () {
        try {
            this.projectDirectory = path.resolve(this.name)
            console.log(chalk.cyan("Creating project..."))

            if (fs.existsSync(this.projectDirectory)) {
                let files
                try {
                    files = await readDir(this.projectDirectory)
                } catch (error) {}

                if (files.length > 0) {
                    throw new Error(`Directory ${chalk.red(this.projectDirectory)} is not empty!`)
                }
            }

            // create project root folder
            await makeDir(this.projectDirectory)

            process.chdir(this.projectDirectory)

            // check if use npm or yarn
            const useNpm = !Project.isYarnInstalled() || this.useNpm
            this.packageManager = useNpm ? "npm" : "yarn"

            await this.cloneTemplate()
            await this.installDependencies()

            const gitInit = await processExit(childProcess.spawn("git", [ "init" ], {
                cwd: this.projectDirectory,
                stdio: "ignore"
            }))

            if (gitInit === 0) {
                console.log()
                console.log(chalk.green("Initialized a git repository"))
            }

            const run = this.packageManager === "npm" ? " run" : ""
            
            console.log()
            console.log(`${chalk.green.bold("Success!")} created ${chalk.yellow(this.name)} at ${this.projectDirectory}`)
            console.log(`Inside that directory, you can run several commands:`)
            console.log()
            console.log(`$ ${chalk.cyan(this.packageManager)}${run} ${chalk.yellow("dev")}`)
            console.log("   Starts the development server.")
            console.log(`$ ${chalk.cyan(this.packageManager)}${run} ${chalk.yellow("build")}`)
            console.log("   Builds the app for production.")
            console.log(`$ ${chalk.cyan(this.packageManager)}${run} ${chalk.yellow("start")}`)
            console.log("   Runs the built app in production mode.")
            console.log()
            console.log(chalk.green.bold("Happy hacking!"))
        } catch (error) {
            loadingSpinner.stop()
            throw error
        }
    }

    getNpmProjectName () {
        // replace capital letters with -[lower case letter]
        var npmName = this.name.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase())
        // remove digits
        npmName = npmName.replace(/[0-9]/g, "")
        // replace spaces with -
        npmName = npmName.replace(/ /g, "-")
        // replace -- with -
        npmName = npmName.replace(/--/g, "-")
        // remove - at the start
        while (npmName.length > 0 && npmName[0] === "-") {
            npmName = npmName.substr(1)
        }
        // remove - at the end
        while (npmName.length > 0 && npmName[npmName.length - 1] === "-") {
            npmName = npmName.slice(0, -1)
        }

        if (npmName.length === 0) {
            throw new Error(`Project name ${chalk.red('"' + this.name + '"')} is not compatible with npm`)
        }

        return npmName
    }

    async cloneTemplate () {
        console.log()
        if (this.template !== "default") {
            process.stdout.write(chalk.cyan("Downloading template... "))
            showSpinner()

            // getting info about repo
            const repoInfo = await this.getRepoInfo()

            if (typeof repoInfo !== "object") {
                throw new Error(repoInfo)
            }

            const { username, name, branch, filePath } = repoInfo

            const contentsUrl = `https://api.github.com/repos/${username}/${name}/contents`
            const packagePath = `${filePath ? "/" + filePath : ""}/package.json`

            const packageExists = await isUrlOk(contentsUrl + packagePath + "?ref=" + branch)
            if (!packageExists) {
                throw new Error(`${chalk.red(this.template)} is not a valid URL for template!`)
            }

            await pipeline(
                got.stream(`https://codeload.github.com/${username}/${name}/tar.gz/${branch}`),
                tar.extract({
                    cwd: this.packageDirectory,
                    strip: filePath ? filePath.split("/").length + 1 : 1
                }, [ `${name}-${branch}${filePath ? "/" + filePath : ""}` ])
            )

            loadingSpinner.stop()
            console.log()
            clearPreviousLine()
            console.log(chalk.green("Template downloaded successfully"))
        } else {
            // convert project name to npm-compatible
            const name = this.getNpmProjectName()

            // creating subfolder to init the project inside it and then copy the package.json
            // @todo find the better way to init the package.json
            const initDirectory = path.join(this.projectDirectory, name)
            await makeDir(initDirectory)

            // initializing npm/yarn project
            console.log(chalk.cyan(`Creating package.json...`))

            // running npm/yarn init -y
            const init = await processExit(childProcess.spawn(this.packageManager, [ "init", "-y" ], {
                cwd: initDirectory,
                stdio: "inherit"
            }))

            // check if package.json created successfully
            if (!fs.existsSync(path.join(initDirectory, "package.json"))) {
                throw new Error(`Error while generating ${chalk.red("package.json")}`)
            }

            // copying package.json to project root
            await copy(path.join(initDirectory, "package.json"), this.projectDirectory)

            // deleting temp folder
            await _rimraf(initDirectory)

            // changing package.json
            const packageJsonPath = path.join(this.projectDirectory, "package.json")
            const packageJson = await readFile(packageJsonPath)
            await writeFile(packageJsonPath, JSON.stringify({
                ...packageJson,
                scripts: {
                    dev: "bon-ui dev",
                    build: "bon-ui build",
                    start: "bon-ui run"
                }
            }))

            console.log(chalk.green(`package.json created successfully`))

            // copying source files to project root
            console.log()
            process.stdout.write(chalk.cyan("Copying template... "))
            showSpinner()
            await copy("**", this.projectDirectory, {
                parents: true,
                cwd: path.join(__dirname, "AppTemplates", "default"),
                rename: basename => {
                    switch (basename) {
                        case "npmignore":
                            return ".npmignore"
                        case "gitignore":
                            return ".gitignore"
                        default:
                            return basename
                    }
                }
            })

            loadingSpinner.stop()
            console.log()
            clearPreviousLine()
            console.log(chalk.green("Template copied successfully"))
        }
    }

    async getRepoInfo () {
        if (Project.isValidTemplateURL(this.template) !== true) {
            return `Template ${chalk.red(this.template)} is ${chalk.red("not a repository")}`
        }

        const url = new URL(this.template)
        const [, username, name, t, branch, ...file] = url.pathname.split("/")
        const filePath = file.join("/")

        if (t === undefined) {
            // then use the default repository branch
            const infoResponse = await got(`https://api.github.com/repos/${username}/${name}`).catch(e => e)
            if (infoResponse.statusCode !== 200) {
                return `Github server returned ${chalk.red(`status ${infoResponse.statusCode}`)} when trying to get repo info`
            }

            const info = JSON.parse(infoResponse.body)
            return { username, name, branch: info["default_branch"], filePath }
        }

        if (username && name && branch && t === "tree") {
            return { username, name, branch, filePath }
        }

        return `URL ${chalk.red(this.template)} is invalid!`
    }

    async installDependencies () {
        // check if use npm or yarn
        const useNpm = !Project.isYarnInstalled() || this.useNpm
        const packageManager = useNpm ? "npm" : "yarn"

        // installing dependencies
        console.log()
        console.log(chalk.cyan("Installing dependencies..."))

        var installArgs = []

        if (this.template === "default") {
            // run `npm install @teplovs/bon-ui --save` / `yarn add @teplovs/bon-ui` 
            if (useNpm) {
                installArgs.push("install", "@teplovs/bon-ui", "--save")
            } else {
                installArgs.push("add", "@teplovs/bon-ui")
            }
        } else {
            // run npm/yarn install
            installArgs.push("install")
        }

        const installed = await processExit(childProcess.spawn(this.packageManager, installArgs, {
            cwd: this.projectDirectory,
            stdio: "inherit"
        }))

        if (installed === 0) {
            console.log(chalk.green("Dependencies installed successfully"))
        } else {
            throw new Error(chalk.red("Error while installing dependencies"))
        }
    }

    // used to ask the user to select a template
    static getTemplatesForPrompt () {
        return {
            "default": "Bon UI default template",
            "example": "Use example from Github repo"
        }
    }

    static isValidTemplateURL (template) {
        try {
            const url = new URL(template)
            if (url.origin !== "https://github.com") {
                return "Non-Github repos are not supported"
            }

            return true
        } catch (error) {
            return "Not a valid URL"
        }
    }

    // analyzes if template is valid or not
    static isValidTemplate (template) {
        if (template in Project.getTemplatesForPrompt()) {
            return true
        }

        return Project.isValidTemplateURL(template)
    }

    static isYarnInstalled () {
        try {
            childProcess.exec("yarnpkg -v")
            return true
        } catch (error) {
            return false
        }
    }
}

exports.Project = Project

