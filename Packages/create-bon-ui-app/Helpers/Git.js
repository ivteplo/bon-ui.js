//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const childProcess = require("child_process")

exports.tryToInitializeGitRepo = function () {
    try {
        childProcess.execSync("git init", { stdio: "ignore" })
        childProcess.execSync("git add --all", { stdio: "ignore" })
        childProcess.execSync('git commit -m "Initial commit"', { stdio: "ignore" })
        return true
    } catch (e) {
        return false
    }
}

