//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const http = require("http")
const https = require("https")
const chalk = require("chalk")
const chokidar = require("chokidar")
const socketIO = require("socket.io")
const EventEmitter = require("events")
const { Builder } = require("./Builder")

exports.createServer = (handler, config = {}) => {
    var server

    if (config.https) {
        server = https.createServer(config.https, (request, response) => {
            handler(request, response)
        })
    } else {
        server = http.createServer((request, response) => {
            handler(request, response)
        })
    }

    const io = socketIO(server)
    console.log(process.env.mode)

    if (process.env.mode === "development") {

        const watcher = chokidar.watch(config.path || ".", {
            ignored: /((^|[\/\\])\..)|(^node_modules$)/
        })

        watcher.on("change", (path, stats) => {
            console.log(chalk.cyan("Rebuilding..."))
            let builder = new Builder({
                env: process.env,
                server: true
            })

            builder.buildProject()
                .then(() => {
                    io.emit("browserReload")
                })
        })
    }

    return server
}

