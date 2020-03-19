//
// Features.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, VStack, Image, Text, Alignment, Fonts, FitType, Length, Measure, HStack, WhiteSpaceStyle } from "../../Sources/BonUI"
import { Feature } from "./Feature"
import { Colors } from "./Config"

export class Features extends View {
    getInitialState () {
        return {}
    }

    getBody () {
        return (
            new VStack([                
                new Feature({
                    heading: new Text("Declarative syntax"),
                    description: new Text("With Bon UI it is very easy to create dynamic and interactive user interfaces. Declarative syntax helps you to navigate in code and to easily understand what it does.")
                                    .setMaxSize({ width: 900 }),
                    code: new Image("./Images/declarative.png", "Example")
                            .setMinSize({ width: 270 })
                            .setMaxSize({ width: 900 })
                            .setSize({ width: new Length(90, Measure.percent) })
                }),

                new Feature({
                    heading: new Text("States system"),
                    description: new Text("Each component has it's own state. When you update the state, the reconciler will automaticly update the DOM.")
                                    .setMaxSize({ width: 900 }),
                    code: new Image("./Images/states.png", "Example")
                            .setMinSize({ width: 270 })
                            .setMaxSize({ width: 900 })
                            .setSize({ width: new Length(90, Measure.percent) })
                }),

                new Feature({
                    heading: new Text("Components from the box"),
                    description: new Text("When you have installed the Bon UI, there are already preinstalled and configured components (which are called views). They have got methods to setup their looking. You can also create your own components easily: your component can depend on other components and use HTML and CSS power.")
                                    .setMaxSize({ width: 900 }),
                    code: new Image("./Images/components.png", "Example")
                            .setMinSize({ width: 270 })
                            .setMaxSize({ width: 900 })
                            .setSize({ width: new Length(90, Measure.percent) })
                })
            ])
                .setAlignment({ horizontal: Alignment.center, vertical: Alignment.center })
                .setMinSize({ height: new Length(100, Measure.viewportHeight) })
        )
    }
}
