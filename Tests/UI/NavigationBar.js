//
// NavigationBar.js
// Created on 23/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, Image, Text, Alignment, Fonts, FitType, Length, Measure, HStack, Weight, Positioning, Link } from "../../Sources/BonUI"
import { Colors } from "./Config"

export class NavigationBar extends View {
    getBody() {
        return (
            new HStack([
                new HStack([
                    new Image("./Images/teplovs.png", "Teplovs")
                        .setSize({ height: 30 }),
                    
                    new HStack([
                        new Link({ url: "https://github.com/teplovs/bon-ui", label: new Text("Github") })
                            .setForeground({ color: Colors.black })
                    ])
                ])
                    .setAlignment({ horizontal: Alignment.spaceBetween, vertical: Alignment.center })
                    .setSize({ width: new Length(100, Measure.percent) })
                    .setMaxSize({ width: 880 })
            ])
                .setPositioning({ type: Positioning.fixed, top: 0, left: 0, right: 0 })
                .setCSSProperty({ property: "backdrop-filter", value: "blur(7px)" })
                .setAlignment({ horizontal: Alignment.center })
                .setBackground({ color: Colors.lightGray.withAlpha(0.8) })
                .setPadding({ all: 20 })
        )
    }
}
