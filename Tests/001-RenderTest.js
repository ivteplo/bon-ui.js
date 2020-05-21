//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { expect } from "chai"
import browserEnv from "browser-env"

browserEnv()

import { View, Text } from "../Sources/BonUI"

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

describe("Render", () => {

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
