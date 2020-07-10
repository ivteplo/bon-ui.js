//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Application, Scene, DOMRenderer, Color } from "../../mod.js"
import { Content } from "./Views/Content.js"

export class App extends Application {
    constructor () {
        super()
        this.renderer = DOMRenderer
    }

    onColorSchemeChange () {
        this.mainColor = Color.orange
    }

    get body () {
        return [
            new Scene("main", new Content()),
        ]
    }
}
