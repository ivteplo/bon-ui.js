//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Application, Scene, DOMRenderer, EmptyView } from "../../mod.js"
import { Content } from "./Views/Content.js"

export class App extends Application {
    constructor () {
        super()
        this.renderer = DOMRenderer
    }

    get body () {
        return [
            new Scene("main", new Content()),
            new Scene("hello", new EmptyView())
        ]
    }
}
