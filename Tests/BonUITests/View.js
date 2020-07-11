//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Application, Scene, View, Text, DOMRenderer, ViewBuilder } from "../../mod.js"
import browserEnv from "browser-env"
import chai from "chai"

const { expect } = chai

global.customElements = {
    define: () => {}
}

browserEnv()

class Content extends View {
    initialState () {
        return {
            counter: 0
        }
    }

    get body () {
        return (
            new Text(this.state.current.counter.toString())
        )
    }
}

class App extends Application {
    get body () {
        return [
            new Scene("main", new Content())
        ]
    }
}

describe("Render", () => {
    it("has to render the DOM correctly", () => {
        const app = new App()
        app.launch()
    
        const sceneDom = app.currentScene.vNode.built
    
        expect(sceneDom.children.length).to.equal(1)
        expect(sceneDom.children[0].innerHTML).to.equal("0")
    })
})

describe("Reconcilation", () => {
    it("has to update the DOM when changed the state value", () => {
        const app = new App()
        app.launch()

        app.currentScene.view.state.set({ counter: 1 })

        const sceneDom = app.currentScene.vNode.built

        expect(sceneDom.children[0].innerHTML).to.equal("1")
    })
})

describe("Server side rendering", () => {
    it("has to generate valid html code", () => {
        const view = new Content()
        const builtView = ViewBuilder.build(view)
        const string = (
            DOMRenderer.vNodeToHTMLString(builtView)
                .replace(/\n/g, "")
                .replace(/\t/g, "")
        )

        expect(string).to.equal("<p>0</p>")
    })
})
