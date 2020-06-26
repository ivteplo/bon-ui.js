//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View, Text } from "../../Sources/BonUI/BonUI.js"

export class ContentView extends View {
    constructor () {
        super()
        window.addEventListener("click", () => {
            this.state.set({ counter: this.state.current.counter + 1 })
        })
    }

    initialState () {
        return { counter: 15 }
    }

    body () {
        return (
            new Text(this.state.current.counter)
        )
    }
}
