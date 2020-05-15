//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const got = require("got")
const tar = require("tar")
const path = require("path")
const chalk = require("chalk")
const { isUrlOk } = require("./URL")
const { promisify } = require("util")
const { pipeline: _pipeline } = require("stream")

const pipeline = promisify(_pipeline)

/**
 * Function to load the list of examples from the Bon UI Github repository
 */
exports.listExamples = async function () {
    const result = await got("https://api.github.com/repos/teplovs/bon-ui/contents/Examples/")
    return JSON.parse(result.body)
}

/**
 * Function to get the information about the repository if the URL is given
 * @param {URL} url
 */
exports.getRepoInfo = async function (url) {
    const [ , username, repo, _treeOrBlob, _branch, ..._filePath ] = url.pathname.split("/")
    
    let branch

    // use default branch if branch is not specified
    if (!_branch || !_treeOrBlob) {
        let infoResponse = await got(`https://apit.github.com/repos/${username}/${repo}`).catch(e => e)
        if (infoResponse.statusCode !== 200) {
            console.error(`Invalid URL passed: no such repo ${chalk.red(username + "/" + repo)}`)
            process.exit(1)
        }
        
        const info = JSON.parse(infoResponse.body)
        branch = info["default_branch"]
    } else {
        branch = _branch
    }

    const result = {
        username, repo, branch,
        rootFolder: "/",
    }

    if (_treeOrBlob) {
        switch (_treeOrBlob) {
            case "tree":
                // the root folder is specified
                result.rootFolder = _filePath.join("/")
                break
            case "blob":
                // the file is specified
                result.rootFolder = path.dirname(_filePath.join("/"))
                break
            default:
                console.error("Invalid URL passed")
                process.exit(1)
        }
    }

    return result
}

/**
 * Function to download and extract the repo 
 * @param {String} appPath      Path to the app for which the repo will be downloaded
 * @param {Object} options
 * @param {String} options.username
 * @param {String} options.repo
 * @param {String} [options.rootFolder]
 * @param {String} branch
 */
exports.downloadAndExtractRepo = async function (appPath, { username, repo, rootFolder, branch }) {
    return pipeline(
        got.stream(`https://codeload.github.com/${username}/${repo}/tar.gz/${branch}`),
        tar.extract({
            cwd: appPath, 
            strip: rootFolder ? rootFolder.split("/").length + 1 : 1
        }, [ `${repo}-${branch}${rootFolder ? "/" + rootFolder.trimLeft("/") : ""}` ])
    )
}

/**
 * Function to check if repo exists and if it has package.json file
 */
exports.isRepoOk = function ({ username, repo, filePath, branch }) {
    const repoPath = `https://api.github.com/repos/${username}/${repo}/contents/${(filePath || "").trim("/")}/package.json`
    
    if (branch) {
        repoPath += `?ref=${branch}`
    }

    return isUrlOk(repoPath)
}

exports.repoHasExample = function (exampleName) {
    return isUrlOk(`https://api.github.com/repos/teplovs/bon-ui/contents/Examples/${
        encodeURIComponent(exampleName)
    }/package.json`)
}

