//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import babel from '@rollup/plugin-babel'

var env = "development"

if (process.env.NODE_ENV === "production") {
    env = "production"
}

console.log(`Building ${env} bundle`)

export default {
    input: "./BonUI/BonUI.js",
    plugins: [
        babel({
            babelHelpers: "bundled",
            exclude: /^(node_modules|bower_components)$/g,
            presets: [
                "@babel/preset-env"
            ],
            plugins: [
                "@babel/plugin-proposal-class-properties"
            ],
            env: {
                production: {
                    presets: [ "minify" ]
                }
            }
        })
    ],
    output: [
        {
            file: `esm/BonUI.${env}.js`,
            format: "esm"
        },
        {
            file: `umd/BonUI.${env}.js`,
            format: "umd",
            name: "BonUI"
        }
    ]
}
