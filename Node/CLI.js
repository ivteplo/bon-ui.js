#!/usr/bin/env node
//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const packageJson = require("../package.json")
const { Command } = require("commander")
const chalk = require("chalk")

const { Builder } = require("./Builder")

var command 

const commands = {
    build: (
        new Command("build")
            .description("Command to build Bon UI app")
            .action(() => {
                command = "build"
            })
            .option("--only-bundle", "Generate only bundle for the client app")
            .option("--no-server", "Generate HTML for the app without server")
    ),

    run: (
        new Command("run")
            .description("Command to run built Bon UI app")
            .action(() => {
                command = "run"
            })
    ),

    dev: (
        new Command("dev")
            .description("Command to build Bon UI app")
            .action(() => {
                command = "dev"
            })
            .option("--only-bundle", "Generate only bundle for the client app")
            .option("--no-server", "Generate HTML for the app without server")
    ),

    create: (
        new Command("create")
            .description("Command to create Bon UI app")
            .action(() => {
                command = "create"
            })
    )
}

const program = (
    new Command("bon-ui")
        .version(packageJson.version)
        .arguments("[command] [options]")
        .usage("[command] [options]")
        .allowUnknownOption()
)

for (let command in commands) {
    program.addCommand(commands[command])
}

program.on("--help", () => {
    console.log()
    console.log(
    `To ${chalk.yellow("build")} the Bon UI app, run:
    ${chalk.cyan(program.name())} ${chalk.yellow("build")}`
    )
    console.log(
    `To ${chalk.yellow("run")} the built Bon UI app, execute:
    ${chalk.cyan(program.name())} ${chalk.yellow("run")}`
    )
    console.log(
    `To ${chalk.yellow("create")} a new Bon UI app, run:
    ${chalk.cyan(program.name())} ${chalk.yellow("create")}`
    )
    console.log()
    console.log(
    `If you need help about ${chalk.yellow("how to use a specific command")}, run:
    ${chalk.cyan(program.name())} ${chalk.yellow("<command-name>")} --help`
    )
    console.log()
    console.log(
    `Bon UI uses file ${chalk.yellow("AppManager.js")} as the main file for the client app,
            file ${chalk.yellow("Server.js")} as the main file for the server app`
    )
    console.log()
})

program.parse(process.argv)

if (!command || !(command in commands)) {
    program.outputHelpInformation()
    process.exit(0)
}


switch (command) {
    case "build": 
        {
            let builder = new Builder({
                onlyBundle: Boolean(commands.build.onlyBundle),
                server: Boolean(commands.build.server),
            })

            builder.buildProject()
                .catch(error => {
                    console.error(error)
                    process.exit(1)
                })
        }
        break
    case "run":
        {
            let builder = new Builder({})

            builder.runApp()
                .catch(error => {
                    console.error(error)
                    process.exit(1)
                })
        }
        break
    case "dev":
        {
            let builder = new Builder({
                port: commands.dev.port ? parseInt(commands.dev.port) : 3000,
                server: true
            })

            builder.options.env.mode = "development"

            builder.runDevServer()
                .catch(error => {
                    console.error(error)
                    process.exit(1)
                })
        }
        break
}

