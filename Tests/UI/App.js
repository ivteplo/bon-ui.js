//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, VStack, normalizeDocumentStyles, Fonts, Length, Measure, Alignment, viewportWidth, Application } from "../../Sources/BonUI"
import { NavigationBar } from "./NavigationBar"
import { Features } from "./Features"
import { appTitle } from "./Config"
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
                .setSize({ width: viewportWidth(100) })
                .setAlignment({ horizontal: Alignment.center })
        )
    }
}

normalizeDocumentStyles({ flexBody: true })
Application.setTitle(appTitle)
Application.setView(new App())

