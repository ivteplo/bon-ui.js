//
// RenderTest.js
// Created on 11/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { expect } from "chai"
import browserEnv from "browser-env"

browserEnv()

import { View, Text } from "../Sources/BonUI"

class AppView extends View {
    getInitialState () {
        return {
            text: "Hello world!"
        }
    }

    getBody () {
        return (
            new Text(this.state.get("text"))
        )
    }
}

const content = new AppView()
content.mountTo(document.body)

describe("Render", () => {

    it("should append child to the body", () => {
        expect(content.mounted).to.equal(true)
        expect(content.lastVNode.dom.parentNode.tagName).to.equal("BODY")
        expect(content.lastVNode.dom.innerHTML).to.equal("Hello world!")
    })
    
    it("should update DOM on state change", () => {
        content.state.set("text", "Hi!")
        expect(content.lastVNode.dom.innerHTML).to.equal("Hi!")
    })

})
