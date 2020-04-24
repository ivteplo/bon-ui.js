//
// 002-ReconcilationTest.js
// Created on 17/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { expect } from "chai"
import browserEnv from "browser-env"
import { View, Text, VStack } from "../Sources/BonUI"

browserEnv()

class MyView extends View {
    handleMount() {
        console.log("HI!!!")
    }

    getBody() {
        return new Text("world!")
    }
}

class AppView extends View {
    getInitialState () {
        return { text: null }
    }

    getBody () {
        return (
            new VStack([
                !this.state.get("text") ? null :
                    new Text(this.state.get("text")),

                new MyView()
                    .setKey(1),

                new MyView()
                    .setKey(2)
            ])
        )
    }
}

const content = new AppView()
content.mountTo(document.body)
content.state.set({ text: "HI!" })

describe("Reconcilation", () => {

    it("must not remount items with key specified", () => {
    //    expect(window.mountedTimes).to.equal(2)
    })

})

