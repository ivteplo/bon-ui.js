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
            text: "Hello world!"
        }
    }

    getBody () {
        return (
            new VStack([
                new Text("Click me pls!")
                    .setOffset({ bottom: 20 }),
                new Button(
                    new Text(this.state.get("text"))
                )
                    .setHandlerFor({
                        event: "click", 
                        handler: () => {
                            console.log("Click!")
                            this.state.set("text", "Thanks!")
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
