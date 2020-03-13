//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, Enum, Button, HStack, VStack, ZStack, List, normalizeDocumentStyles, Fonts, Text, Link, Canvas, Alignment, Image, FitType } from "../../Sources/BonUI"
import { Colors } from "./Config"

class App extends View {
    getInitialState () {
        return {}
    }

    getBody () {
        return (
            new VStack([
                new Image("/bon-ui.png", "Logo")
                    .setSize({ width: 200, height: 200 })
                    .setFitType(FitType.contain),
                new Text("Bon UI")
                    .setFont(Fonts.largeTitle)
                    .setOffset({ top: 10, bottom: 10 })
                    .setForeground({ color: Colors.orange }),
                new Text("A new framework\nfor developing web applications")
                    .setAlignment(Alignment.center)
            ])
                .setAlignment({ horizontal: Alignment.center })
        )
    }
}

const app = new App()
normalizeDocumentStyles({ flexBody: true })
app.mountTo(document.body)
