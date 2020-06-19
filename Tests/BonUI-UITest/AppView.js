//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View, Text, Edge, pixels } from "../../Sources/BonUI/BonUI.js"

export class AppView extends View {
    initialState () {
        return { counter: 0 }
    }

    body () {
        return (
            new Text("Counter: " + this.state.current.counter)
                .padding(Edge.bottom, pixels(10))
        )
    }
}
