//
// 004-RouterTest.js
// Created on 12/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { expect } from "chai"
import browserEnv from "browser-env"
import { View, Text, Router, Route, ApplicationManager } from "../Sources/BonUI"

class AppView extends View {
    getInitialState () {
        return { text: "Hello world!" }
    }

    getBody () {
        return (
            new Router(this.options.getPath(), [
                new Route({
                    path: "/",
                    view: new Text("Welcome to the home!")
                }),
                new Route({
                    path: "/articles",
                    view: new Text("Welcome to articles page")
                }),
                new Route({
                    path: "/articles/hello",
                    view: new Text("Article: hello")
                }),
                new Route({
                    path: "/something",
                    exact: false,
                    view: new Text("Something")
                })
            ])
        )
    }
}

const content = new AppView({ getPath: () => "/" })
var result = content.toString()

describe("Router test", () => {

    it("must return home page if path is '/'", () => {
        expect(result).to.equal(`<p style='user-select:none;margin:0;padding:0;'>Welcome to the home!</p>`)
    })
    
    it("must return articles page if path is '/articles'", () => {
        content.options.getPath = () => "/articles"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0;padding:0;'>Welcome to articles page</p>`)
    })

    it("must return 'hello' article page if path is '/articles/hello'", () => {
        content.options.getPath = () => "/articles/hello"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0;padding:0;'>Article: hello</p>`)
    })

    it("must return the same result if path is '/something/[any path]'", () => {
        content.options.getPath = () => "/something"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0;padding:0;'>Something</p>`)
        content.options.getPath = () => "/something/else"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0;padding:0;'>Something</p>`)
    })

})
