//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { View, Text, Router, Route, ApplicationManager } from "../../BonUI.js"

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

console.log("Router test")
    console.log(" - must return home page if path is '/'")
        assertEquals(result, `<p style='user-select:none;margin:0px;padding:0px;'>Welcome to the home!</p>`)
    console.log("   -> passed")
    
    console.log(" - must return articles page if path is '/articles'")
        content.options.getPath = () => "/articles"
        result = content.toString()
        assertEquals(result, `<p style='user-select:none;margin:0px;padding:0px;'>Welcome to articles page</p>`)
    console.log("   -> passed")

    console.log(" - must return 'hello' article page if path is '/articles/hello'")
        content.options.getPath = () => "/articles/hello"
        result = content.toString()
        assertEquals(result, `<p style='user-select:none;margin:0px;padding:0px;'>Article: hello</p>`)
    console.log("   -> passed")

    console.log(" - must return the same result if path is '/something/[any path]'")
        content.options.getPath = () => "/something"
        result = content.toString()
        assertEquals(result, `<p style='user-select:none;margin:0px;padding:0px;'>Something</p>`)
        content.options.getPath = () => "/something/else"
        result = content.toString()
        assertEquals(result, `<p style='user-select:none;margin:0px;padding:0px;'>Something</p>`)
    console.log("   -> passed")

