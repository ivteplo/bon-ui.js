//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { expect } from "chai"
import browserEnv from "browser-env"
import { View, Text, VStack } from "../Sources/BonUI"

browserEnv()

window.mountedTimes = 0

function incrementMountedTimes () {
    window.mountedTimes += 1
}

class AppView extends View {
    initialState () {
        return { text: null }
    }

    body () {
        return (
            new VStack([
                !this.state.get("text") ? null :
                    new Text(this.state.get("text")),

                new Text("Hello")
                    .setKey(1)
                    .handle("mounting", incrementMountedTimes),

                new Text("world!")
                    .setKey(2)
                    .handle("mounting", incrementMountedTimes)
            ])
        )
    }
}

const content = new AppView()
content.mountTo(document.body)
content.state.set({ text: "HI!" })

describe("Reconcilation", () => {

    it("must not remount items with key specified", () => {
        expect(window.mountedTimes).to.equal(2)
    })

})

