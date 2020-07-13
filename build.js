//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { rollup, watch as rollupWatch } from "rollup"
import babel from "@rollup/plugin-babel"

const watch = process.env.WATCH == 1 ?? false
const babelConfig = {
    babelHelpers: "bundled",
    presets: [
        "@babel/preset-env"
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties"
    ],
    env: {
        production: {
            presets: [
                [ "minify", { builtIns: false } ]
            ]
        }
    }
}

var environments = process.env.NODE_ENV ?? "all"
var formats = process.env.FORMAT ?? "all"

const input = "./BonUI/BonUI.js"
const plugins = [
    babel.default(babelConfig)
]
const watchOptions = {
    buildDelay: 500,
    clearScreen: true,
    exclude: /^(node_modules|bower_components)$/
}

if (environments === "all") {
    if (watch) {
        console.log("Sorry, but some environments while watching are not supported")
        environments = [ "development" ]
    } else {
        environments = [
            "development",
            "production"
        ]
    }
} else {
    environments = environments.split(",")
}

if (formats === "all") {
    formats = [
        "esm",
        "umd"
    ]
} else {
    formats = formats.split(",")
}

if (watch) {
    loadWatchers()
} else {
    build()
}

async function build () {
    for (let env of environments) {
        process.env.NODE_ENV = env

        console.log()
        const bundle = await rollup({
            input,
            plugins
        })
    
        for (let format of formats) {
            console.log(`\nBuilding Bon UI ${format} bundle for ${env}`)
            
            const output = getRollupConfig({ format, env })
            await bundle.write(output)

            console.log(`${input} -> ${output.file} - done`)
        }
    }
}

function loadWatchers () {
    const env = environments[0]
    const options = {
        input,
        plugins,
        output: [],
        watch: watchOptions
    }

    for (let format of formats) {
        options.output.push(getRollupConfig({ format, env }))
    }

    const watcher = rollupWatch(options)
    watcher.on("event", event => {
        switch (event.code) {
            case "START":
                console.log("\nRegenerating bundle")
                break
            case "END":
                console.log("Bundle(s) generated successfully")
                break
            case "ERROR":
                console.log("Could not generate bundle(s)")
                break
        }
    })
}

function getRollupConfig ({ format, env }) {
    let output = {
        file: `./${format}/BonUI.${env}.js`,
        format
    }

    if (format === "umd") {
        output.name = "BonUI"
    }

    return output
}
