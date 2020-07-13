//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Application, Scene, View, Text, DOMRenderer, ViewBuilder, EmptyView } from "../../mod.js"
import { setupBrowserEnvironment } from "./Helpers/Browser.js"
import chai from "chai"

const { expect } = chai

setupBrowserEnvironment()

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
            new Scene("main", new Content()),
            new Scene("empty", new EmptyView())
        ]
    }
}

describe("Render", () => {
    it("has to render the DOM correctly", () => {
        const app = new App()
        app.launch()
    
        const sceneDom = app.currentScene.vNode.built
    
        expect(sceneDom.childNodes.length).to.equal(1)
        expect(sceneDom.childNodes[0].innerHTML).to.equal("0")
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

describe("Scene change", () => {
    it("has to scene the scene correctly", () => {
        const app = new App()
        app.launch()

        var sceneDom = app.currentScene.vNode.built

        expect(app.currentScene.name).to.equal("main")
        expect(sceneDom.childNodes.length).to.equal(1)
        expect(sceneDom.childNodes[0].innerHTML).to.equal("0")
        
        app.loadScene("empty")

        sceneDom = app.currentScene.vNode.built

        expect(app.currentScene.name).to.equal("empty")
        expect(sceneDom.childNodes.length).to.equal(1)
        expect(sceneDom.childNodes[0].innerHTML).to.equal("")
        
        app.loadScene(app.getScene("main"))

        sceneDom = app.currentScene.vNode.built

        expect(app.currentScene.name).to.equal("main")
        expect(sceneDom.childNodes.length).to.equal(1)
        expect(sceneDom.childNodes[0].innerHTML).to.equal("0")
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
