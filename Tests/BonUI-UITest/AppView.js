//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View, Text, Edge, Font, Row, Column, Alignment, pixels } from "../../Sources/BonUI/BonUI.js"

export class AppView extends View {
    initialState () {
        return { counter: 16 }
    }

    body () {
        return (
            new Column([
                new Text("Counter: ")
                    .font(Font.title),
                new Text(this.state.current.counter.toString())
                    .font(Font.default.with({ size: pixels(this.state.current.counter) }))
            ], { alignment: Alignment.center })
            .padding()
        )
    }
}
