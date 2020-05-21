//
// rollup.config.js
// Created on 29/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

const path = require("path")

module.exports = [
    {
        input: path.join(__dirname, "../Sources/BonUI.js"),
        output: {
            format: "esm",
            file: path.join(__dirname, "../Distribution/BonUI.esm.js")
        }
    },
    {
        input: path.join(__dirname, "../Sources/BonUI.js"),
        output: {
            format: "umd",
            name: "BonUI",
            file: path.join(__dirname, "../Distribution/BonUI.umd.js")
        }
    },
    {
        input: path.join(__dirname, "../Sources/BonUI.js"),
        output: {
            format: "cjs",
            file: path.join(__dirname, "../Distribution/BonUI.cjs.js")
        }
    }
]
