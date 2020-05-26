//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { expect } from "chai"
import browserEnv from "browser-env"
import { View, Text, Router, Route, ApplicationManager } from "../Sources/BonUI"

class AppView extends View {
    initialState () {
        return { text: "Hello world!" }
    }

    body () {
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
        expect(result).to.equal(`<p style='user-select:none;margin:0px;padding:0px;'>Welcome to the home!</p>`)
    })
    
    it("must return articles page if path is '/articles'", () => {
        content.options.getPath = () => "/articles"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0px;padding:0px;'>Welcome to articles page</p>`)
    })

    it("must return 'hello' article page if path is '/articles/hello'", () => {
        content.options.getPath = () => "/articles/hello"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0px;padding:0px;'>Article: hello</p>`)
    })

    it("must return the same result if path is '/something/[any path]'", () => {
        content.options.getPath = () => "/something"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0px;padding:0px;'>Something</p>`)
        content.options.getPath = () => "/something/else"
        result = content.toString()
        expect(result).to.equal(`<p style='user-select:none;margin:0px;padding:0px;'>Something</p>`)
    })

})
