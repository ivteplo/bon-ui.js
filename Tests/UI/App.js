//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import {TextBox, View, VStack, normalizeDocumentStyles, Fonts, Length, Measure, Alignment } from "../../Sources/BonUI"
import { NavigationBar } from "./NavigationBar"
import { Features } from "./Features"
import { Header } from "./Header"

class App extends View {
    getBody () {
        return (
            new VStack([
                new NavigationBar(),
                new Header(),
                new Features()
            ])
                .setFont(Fonts.default)
                .setSize({ width: new Length(100, Measure.viewportWidth) })
                .setAlignment({ horizontal: Alignment.center })
        )
    }
}

const app = new App()
normalizeDocumentStyles({ flexBody: true })
app.mountTo(document.body)

