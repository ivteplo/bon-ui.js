//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const got = require("got")

/**
 * Function to check if string is a valid URL
 */
exports.isValidUrl = function (str) {
    try {
        let url = new URL(str)
    } catch (e) {
        return false
    }

    return true
}

/**
 * Function to check if request returns code 200
 */
exports.isUrlOk = async function (url) {
    const result = await got(url).catch(e => e)
    return result.statusCode === 200
}

/**
 * Function to check if URL origin is Github
 */
exports.isGithubUrl = function (url) {
    return exports.isValidUrl(url) && new URL(url).origin === "https://github.com"
}

