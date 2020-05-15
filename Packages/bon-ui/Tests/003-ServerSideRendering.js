//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { expect } from "chai"
import browserEnv from "browser-env"
import { View, Text, ApplicationManager } from "../Sources/BonUI"

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

describe("Server side rendering", () => {

    it("must correctly render to HTML string", () => {
        expect(result).to.equal(`<p style='user-select:none;margin:0px;padding:0px;'>Hello world!</p>`)
    })
    
    it("must not update state when rendering from server, and not set mounted to true", () => {
        expect(content.state.get("text")).to.equal("Hello world!")
        expect(content.isMounted).to.equal(false)
    })

})
