//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, Color, Enum, HStack, VStack, colors, normalizeDocumentStyles, fonts, Text } from "../../Sources/FrontendUI"

function objMap (obj, fn) {
    let result = []

    for (let i in obj) {
        result.push(fn(obj[i], i))
    }

    return result
}

normalizeDocumentStyles({ flexBody: true })

class App extends View {
    getInitialState () {
        return {}
    }

    getBody () {
        return (
            new HStack([
                new Text("Hello world!")
                    .setOffset({ bottom: 20 }),
                new VStack([
                    new Text("Hi!")
                        .setOffset({ left: 20 }),
                    new Text("Hi!")
                        .setOffset({ left: 20 })
                ])
            ])
        )
    }
}

window.Enum = Enum

const app = new App()
app.mountTo(document.body)
