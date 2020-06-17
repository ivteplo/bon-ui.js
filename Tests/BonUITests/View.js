//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import chai from "chai"
import browserEnv from "browser-env"
import { View, Text, VStack } from "../../Sources/BonUI/BonUI.js"

const { expect } = chai

browserEnv()

describe("Render", () => {
    class AppView extends View {
        initialState () {
            return { text: "Hello world!" }
        }

        body () {
            return (
                new Text(this.state.get("text"))
            )
        }
    }

    const content = new AppView()
    content.mountTo(document.body)

    it("must append child to the body", () => {
        expect(content.isMounted).to.equal(true)
        expect(content.lastVNode.dom.parentNode.tagName).to.equal("BODY")
        expect(content.lastVNode.dom.innerHTML).to.equal("Hello world!")
    })
    
    it("must update DOM on state change", () => {
        content.state.set({ text: "Hi!" })
        expect(content.lastVNode.dom.innerHTML).to.equal("Hi!")
    })

})

describe("Reconcilation", () => {
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

    it("must not remount items with key specified", () => {
        expect(window.mountedTimes).to.equal(2)
    })
})

describe("Server side rendering", () => {
    class AppView extends View {
        initialState () {
            return {
                text: "Hello world!"
            }
        }

        body () {
            this.state.set("text", "Hi!")
            return (
                new Text(this.state.get("text"))
            )
        }
    }

    const content = new AppView()
    const result = content.toString()

    it("must correctly render to HTML string", () => {
        expect(result).to.equal(`<p style='box-sizing:border-box;user-select:none;margin:0px;padding:0px;color:inherit;'>Hello world!</p>`)
    })
    
    it("must not update state when rendering from server, and not set isMounted to true", () => {
        expect(content.state.get("text")).to.equal("Hello world!")
        expect(content.isMounted).to.equal(false)
    })
})

