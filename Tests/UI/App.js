//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, Enum, Button, HStack, VStack, ZStack, List, normalizeDocumentStyles, Fonts, Text, Link, Canvas, Alignment, Image, FitType, Length, Measure } from "../../Sources/BonUI"
import { Colors } from "./Config"
import { Header } from "./Header"
import { Features } from "./Features"

class App extends View {
    getInitialState () {
        return {}
    }

    getBody () {
        return (
            new VStack([
                new Header(),
                new Features()
            ])
                .setFont(Fonts.default)
                .setSize({ width: new Length(100, Measure.viewportWidth) })
        )
    }
}

const app = new App()
normalizeDocumentStyles({ flexBody: true })
app.mountTo(document.body)
