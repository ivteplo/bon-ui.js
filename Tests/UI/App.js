//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, Color, Enum, Button, HStack, VStack, ZStack, colors, normalizeDocumentStyles, fonts, Text } from "../../Sources/FrontendUI"

normalizeDocumentStyles({ flexBody: true })

class App extends View {
    getInitialState () {
        return {
            text: 1
        }
    }

    getBody () {
        return (
            new VStack([
                new Text("Increment the counter!")
                    .setOffset({ bottom: 20 }),
                new Button(
                    new Text("Counter: " + this.state.get("text").toString())
                )
                    .setHandlerFor({
                        event: "click", 
                        handler: (event) => {
                            this.state.set("text", this.state.get("text") + 1)
                        }
                    })
            ])
                .setAlignment({ horizontal: "center" })
        )
    }
}

window.Enum = Enum

const app = new App()
app.mountTo(document.body)
