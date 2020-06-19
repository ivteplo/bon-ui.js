//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ApplicationDelegate } from "../../Sources/BonUI/BonUI.js"

export class AppDelegate extends ApplicationDelegate {
    applicationWillLoad (application) {
        console.log("Application will load", application)
    }

    applicationStarted (application) {
        window.addEventListener("click", () => {
            application.view.state.set({
                counter: application.view.state.current.counter + 1
            })
        })
        console.log("Application started", application)
    }

    applicationLostFocus (application) {
        console.log("Application lost focus", application)
    }

    applicationGotFocus (application) {
        console.log("Application got focus", application)
    }

    applicationWillClose (application) {
        // console.log("Application will close", application)
        // return "Are you sure you want to leave current page?"
    }

    applicationIsClosing (application) {
        // for example, you can send a request to the specific website
        // var xhr = new XMLHttpRequest()
        // xhr.open("POST", "http://localhost:8080", false)
        // xhr.send()
    }
}
