//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const chalk = require("chalk")
const spawn = require("cross-spawn")

exports.install = function (root, dependencies, { useYarn, isOnline }) {
    return new Promise((resolve, reject) => {
        let command
        let args = []

        if (useYarn) {
            command = "yarnpkg"
            args = dependencies ? [ "add", "--exact" ] : [ "install" ]

            if (dependencies) {
                args.push(...dependencies)
            }

            args.push("--cwd", root)

            if (!isOnline) {
                console.log(chalk.yellow("Looks like you are offline"))
                console.log(chalk.yellow("Using local Yarn cache"))
                console.log()
            }
        } else {
            command = "npm"
            args = [ "install" ]

            if (dependencies) {
                args.push(...dependencies, "--save", ...dependencies, "--save-exact")
            }

            args.push("--log-level", "error")
        }

        const child = spawn(command, args, {
            stdio: "inherit",
            env: { ...process.env }
        })

        child.on("close", code => {
            if (code !== 0) {
                reject({ command: `${command} ${args.join(" ")}` })
                return
            }

            resolve()
        })
    })
}

