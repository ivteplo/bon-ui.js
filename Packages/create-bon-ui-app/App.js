//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const path = require("path")
const chalk = require("chalk")
const prompts = require("prompts")
const packageJson = require("./package.json")

const { Command } = require("commander")
const { createApp } = require("./CreateApp")
const { isGithubUrl } = require("./Helpers/URL")
const { listExamples } = require("./Helpers/Examples")
const { validateProjectName } = require("./Helpers/ProjectNameValidator.js")

var projectPath

const program = (
	new Command(packageJson.name)
        .version(packageJson.version)
        .arguments("[project-name]")
        .usage(`${chalk.green("<project-directory>")} [options]`)
        .action(name => {
            projectPath = name
        })
        .description("Create a new Bon UI project")
        .option("--use-npm", "Use npm even if yarn is installed")
        .option("--template [name]|[github-url]", `
Use a specific template (or example) to bootstrap your app with. 
You can use a template (example) name from the official Bon UI repo
or a Github URL. The URL can use any branch and/or subdirectory.
        `.trim())
        .allowUnknownOption()
        .parse(process.argv)
)

async function run () {
    console.log()

    if (typeof projectPath === "string") {
        projectPath = projectPath.trim()
    }

    if (projectPath === undefined) {
        let projectName = await prompts({
            type: "text",
            name: "value",
            initial: "my-app",
            message: "What's the name of your project?",
            validate: value => {
                const validationResult = validateProjectName(value)
                return validationResult.valid ? true : "Invalid project name: " + validationResult.problems[0]
            }
        })

        if (typeof projectName.value === "string") {
            projectPath = projectName.value.trim()
        }
    }
    
     if (!projectPath) {
        console.error("Please, specify the project directory:")
        console.error(`${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`)
        console.error()
        console.error("For example:")
        console.error(`    ${chalk.cyan(program.name())} ${chalk.green("my-bon-ui-app")}`)
        console.error()
        console.error(`Run ${chalk.cyan(program.name() + " --help")} to see all options.`)
        process.exit(1)
    }

    const resolvedProjectPath = path.resolve(projectPath)
    const projectName = path.basename(resolvedProjectPath)
    
    let validationResult = validateProjectName(projectName)
    if (!validationResult.valid) {
        console.error(`Could not create a project called ${chalk.red(`"${projectName}"`)} because of npm naming restrictions:`)
        validationResult.problems.forEach(problem => console.error(`    ${chalk.red("*")} ${problem}`))
        process.exit(1)
    } 

    const templates = [
        { title: "Bon UI starter app", value: "default" },
        { title: "Example from the Bon UI Github repo", value: "example" },
        { title: "Use someone's repo on Github", value: "repo" }
    ]

    if (!program.template) {
        let template = await prompts({
            type: "select",
            name: "value",
            message: "Pick a template",
            choices: templates 
        })

        if (!template.value) {
            console.error("Please specify the template")
            process.exit(1)
        }

        program.template = template.value
    }

    if (program.template !== "example") {
        let templateExists = false

        for (let i in templates) {
            if (templates[i].value === program.template) {
                templateExists = true
                break
            }
        }

        if (!templateExists && !isValidUrl(program.template)) {
            console.error("Please specify the real template")
            process.exit(1)
        }
    }

    if (program.template === "example") {
        let examplesList

        try {
            examplesList = await listExamples()
        } catch (error) {
            console.error("Failed to fetch the list of exaples with the following error:")
            console.error(error)
            console.log()
            console.log("Switching to default Bon UI app")
            console.log()
            program.example = templates[0].value
        }

        if (examplesList) {
            let choices = examplesList.map(example => ({ title: example.name, value: example.name }))
            let exampleName = await prompts({
                type: "autocomplete",
                name: "value",
                message: "Pick an example",
                choices: choices,
                suggest: (input, choices) => {
                    const regex = new RegExp(input, "i")
                    return choices.filter(choice => regex.test(choice.title))
                }
            })

            if (!exampleName.value) {
                console.error("Please specify an example or use avaliable templates")
                process.exit(1)
            }

            program.template = exampleName.value
        }
    } else if (program.template === "repo") {
        let repo = await prompts({
            type: "text",
            name: "value",
            message: "Paste a full path to the Github repo folder",
            validate: value => isGithubUrl(value)
        })

        if (!repo.value) {
            console.error("Please specify the template root folder")
            process.exit(1)
        }

        program.template = repo.value
    }

    await createApp({
        appPath: resolvedProjectPath,
        useNpm: program.useNpm || false,
        template: (typeof program.template === "string" && program.template.trim()) || undefined
    })
}

if (require.main === module) {
    run()
        .catch(async reason => {
            console.error("Aborting the creation of app")
            if (reason.command) {
                console.error(`    ${chalk.cyan(reason.command)} has failed.`)
            } else {
                console.error(chalk.red("Unexpected error. Please report it as a bug:"))
                console.error(reason)
            }

            console.error()
            process.exit(1)
        })
} else {
    exports.createApp = createApp
}

