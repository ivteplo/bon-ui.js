//
// ServerSide.js
// Created on 12/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { expect } from "chai"
import browserEnv from "browser-env"
import { View, Text, Application } from "../Sources/BonUI"

class AppView extends View {
    getInitialState () {
        return {
            text: "Hello world!"
        }
    }

    getBody () {
        this.state.set("text", "Hi!")
        return (
            new Text(this.state.get("text"))
        )
    }
}

const content = new AppView()
const result = Application.staticRender(content).toString()

describe("Server side rendering", () => {

    it("should correctly render to HTML string", () => {
        expect(result).to.equal(`<p style='user-select:none;margin:0;padding:0;'>Hello world!</p>`)
    })
    
    it("should not update state when rendering from server, and not set mounted to true", () => {
        expect(content.state.get("text")).to.equal("Hello world!")
        expect(content.mounted).to.equal(false)
    })

})
