//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { expect } from "chai"
import browserEnv from "browser-env"

browserEnv()

import { View, Text, ApplicationManager } from "../Sources/BonUI"

class AppView extends View {
    body () {
        return (
            new Text("hello world!")
        )
    }
}

const appManager = new ApplicationManager()
appManager.setView(new AppView())

describe("Application manager", () => {
    it("must add some handlers to the view", () => {
        expect(appManager.view._handlers.mounting.length).to.equal(1)
        expect(appManager.view._handlers.unmounting.length).to.equal(1)
        expect(appManager.view._handlers.invalidation.length).to.equal(1)
        expect(appManager.view._handlers.hydration.length).to.equal(1)
    })
})

