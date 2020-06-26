//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Application, Scene } from "../../Sources/BonUI/BonUI.js"
import { ContentView } from "./ContentView.js"

export class App extends Application {
    body () {
        return [
            new Scene("main", new ContentView())
        ]
    }
}
