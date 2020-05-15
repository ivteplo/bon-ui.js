//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const childProcess = require("child_process")

/**
 * Function that is used to check if yarn is installed
 */
exports.isYarnInstalled = function () {
    try {
        const userAgent = process.env.npm_config_user_agent

        if (userAgent) {
            return Boolean(userAgent && userAgent.startsWith("yarn"))
        }

        childProcess.execSync("yarnpkg --version", { stdio: "ignore" })
        return true
    } catch (e) {
        return false
    }
}

