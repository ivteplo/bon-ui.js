//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View, Text, Button, Column, Row, Spacer } from "../../Sources/BonUI/BonUI.js"

export class ContentView extends View {
    constructor () {
        super()
    }

    initialState () {
        return { counter: 15 }
    }

    body () {
        return (
            new Row([
                new Text("Random text"),

                new Spacer(),
                
                new Column([
                    new Text("Counter: " + this.state.current.counter),
                
                    new Button(
                        new Text("Increment"),
                        () => {
                            this.state.set({
                                counter: this.state.current.counter + 1
                            })
                        }
                    )
                ])
            ])
        )
    }
}
