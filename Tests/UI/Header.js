//
// Header.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, VStack, Image, Text, Alignment, Fonts, FitType, Measure, Length } from "../../Sources/BonUI"
import { Colors } from "./Config"

export class Header extends View {
    getBody () {
        return (
            new VStack([
                new Image("./Images/bon-ui.png", "Logo")
                    .setSize({ width: 200, height: 200 })
                    .setFitType(FitType.contain),
                new Text("Bon UI")
                    .setFont(Fonts.largeTitle)
                    .setOffset({ top: 10, bottom: 10 })
                    .setForeground({ color: Colors.orange }),
                new Text("A new framework\nfor developing web applications")
                    .setAlignment(Alignment.center)
            ])
                .setAlignment({ horizontal: Alignment.center, vertical: Alignment.center })
                .setMinSize({ height: new Length(100, Measure.viewportHeight) })
        )
    }
}
