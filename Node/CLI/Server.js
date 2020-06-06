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

    if (process.env.mode === "development") {

        const watcher = chokidar.watch(config.path || ".", {
            ignored: /((^|[\/\\])\..)|(^node_modules$)/
        })

        watcher.on("change", (path, stats) => {
            console.log()
            console.log(chalk.cyan("Rebuilding..."))
            let builder = new Builder({
                env: process.env,
                server: true
            })

            builder.buildProject()
                .then(() => {
                    console.log()
                    io.emit("browserReload")
                })
        })
    }

    return server
}

exports.generateHTML = (appManager, { bundleFile = "bundle.mjs", serviceWorker = null, bundleEsm = true, socketIoReload = false, port = 3000, serverSideRendering = false } = {}) => {
    var html = ""
    html += "<!DOCTYPE html>\n"
    html += "<html>\n"
    html += "    <head>\n"

    if (serverSideRendering) {
        html += "        " + appManager.getHeadString().replace("\n", "\n        ") + "\n"
    }

    html += "        <meta charset=\"utf-8\">\n"
    html += "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
    html += "    </head>\n"
    html += "    <body>\n"
    html += "        <div id=\"root\">\n"

    if (serverSideRendering) {
        html += "            " + appManager.getViewString() + "\n"
    }

    html += "        </div>\n"

    if (bundleEsm) {
        html += `        <script type="module">\n`
        html += `            import AppManager from "/${bundleFile}"\n`
    } else {
        html += `        <script src="${bundleFile}" type="text/javascript">\n`
        html += `        <script>\n`
        html += `            (function () {\n`
    }

    html += `            const appManager = new AppManager({ pathname: location.pathname })\n`

    if (process.env.NODE_ENV === "development") {
        html += `            console.time("App loading")\n`
    }

    html += `            window.addEventListener("load", () => {\n`
    if (serverSideRendering) {
        html += `                appManager.loadApp({ node: document.querySelector("#root").children[0] })\n`
    } else {
        html += `                appManager.loadApp({})\n`
    }

    if (process.env.NODE_ENV === "development") {
        html += `                    .then(() => { console.timeEnd("App loading") })\n`
    }

    html += `                    .catch(error => {\n`
    html += `                        alert("Could not load app")\n`

    if (process.env.NODE_ENV === "development") {
        html += `                        console.error(error)\n`
        html += `                        console.timeEnd("App loading")\n`
    }

    html += `                    })\n`
    html += `            })\n`
    
    if (!bundleEsm) {
        html += `        })\n`
    }

    html += `        </script>\n`

    if (socketIoReload && port) {
        html += `        <script src="/socket.io/socket.io.js"></script>\n`
        html += `        <script>\n`
        html += `            var socket = io("http://localhost:${port}")\n`
        html += `            socket.on("browserReload", () => {\n`
        html += `                location.reload()\n`
        html += `            })\n`
        html += `        </script>\n`
    }

    if (serviceWorker) {
        html += `        <script>\n`
        html += `            if ("serviceWorker" in navigator) {\n`
        html += `                navigator.serviceWorker.register("${serviceWorker.replace(/"/g, '\\"')}").then(registration => {\n`
        html += `                    console.log("Service worker registered: ", registration)\n`
        html += `                }).catch(error => {\n`
        html += `                    console.error("Service worker registration failed: ", error)\n`
        html += `                })\n`
        html += `            }\n`
        html += `        </script>\n`
    }

    html += "    </body>\n"
    html += "</html>\n"
    return html
}

