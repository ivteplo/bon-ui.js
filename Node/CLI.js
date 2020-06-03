#!/usr/bin/env node
//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const packageJson = require("../package.json")
const { Command } = require("commander")
const prompts = require("prompts")
const chalk = require("chalk")

const { Builder } = require("./Builder")
const { Project } = require("./Project")

var command 
// used for `bon-ui create`
var appName 

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
            .arguments("[app-name] [options]")
            .usage("[app-name] [options]")
            .action(name => {
                command = "create"
                appName = name
            })
            .option("--template <template>", "Use specific template for the app")
            .option("--use-npm", "Use npm even if yarn is installed")
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

async function runCommand () {
    switch (command) {
        case "build": 
            {
                let builder = new Builder({
                    onlyBundle: Boolean(commands.build.onlyBundle),
                    server: Boolean(commands.build.server),
                })

                return builder.buildProject()
            }
            break
        case "run":
            {
                let builder = new Builder({})

                return builder.runApp()
            }
            break
        case "dev":
            {
                let builder = new Builder({
                    port: commands.dev.port ? parseInt(commands.dev.port) : 3000,
                    server: true
                })

                builder.options.env.mode = "development"

                return builder.runDevServer()
            }
            break
        case "create":
            {
                const options = {
                    name: appName,
                    // this is for people who want to use npm even if yarn is installed
                    useNpm: commands.create.useNpm || false,
                    template: commands.create.template
                }

                if (!options.name) {
                    const name = await prompts({
                        type: "text",
                        name: "value",
                        message: "What is your project name?",
                        validate: value => {
                            const regex = /^([A-Za-z0-9]+((-| )?)[A-Za-z0-9]+)+$/

                            if (!regex.test(value)) {
                                return "Project name can contain only English letters and spaces/dashes"
                            }

                            return true
                        }
                    })

                    if (!name.value) {
                        console.error(`Please, specify the ${chalk.red("project name")}`)
                        process.exit(1)
                    }

                    options.name = name.value
                }

                if (!options.template || Project.isValidTemplate(options.template) !== true) {
                    const templates = Project.getTemplatesForPrompt()
                    const choices = Object.keys(templates).map(key => {
                        return { title: templates[key], value: key }
                    })

                    const template = await prompts({
                        type: "select",
                        name: "value",
                        message: "Please, select a template",
                        choices,
                        validate: value => Project.isValidTemplate(value)
                    })

                    if (!template.value) {
                        console.error(`You have selected ${chalk.red("invalid template")}`)
                        process.exit(1)
                    }

                    options.template = template.value
                }

                if (options.template === "example") {
                    const example = await prompts({
                        type: "text",
                        name: "value",
                        message: "Please, enter URL to project root",
                        validate: value => Project.isValidTemplateURL(value)
                    })

                    if (!example.value) {
                        console.error(`You have selected ${chalk.red("invalid template")}`)
                        process.exit(1)
                    }

                    options.template = example.value
                }

                let project = new Project(options)
                return project.create()
            }
            break
    }
}

runCommand()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })

