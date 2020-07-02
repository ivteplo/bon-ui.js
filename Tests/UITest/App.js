//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Application, Scene } from "../../Sources/BonUI/BonUI.js"
import { Content } from "./Views/Content.js"

export class App extends Application {
    constructor () {
        super()

        this.setTitle("Bon UI")
    }

    body () {
        return [
            new Scene("main", new Content())
        ]
    }
}
