//
// Features.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, VStack, Image, Text, Alignment, Fonts, FitType, Length, Measure, HStack, WhiteSpaceStyle, viewportHeight, percents } from "../../Sources/BonUI"
import { Feature } from "./Feature"
import { Colors } from "./Config"

export class Features extends View {
    getBody () {
        return (
            new VStack([                
                new Feature({
                    heading: new Text("Declarative syntax"),
                    description: new Text("With Bon UI it is very easy to create dynamic and interactive user interfaces. Declarative syntax helps you to navigate in code and to easily understand what it does."),
                    code: new Image({ url: "./Images/declarative.png", altText: "Example" })
                }),

                new Feature({
                    heading: new Text("States system"),
                    description: new Text("Each component has it's own state. When you update the state, the reconciler will automaticly update the DOM."),
                    code: new Image({ url: "./Images/states.png", altText: "Example" })
                }),

                new Feature({
                    heading: new Text("Components from the box"),
                    description: new Text("When you have installed the Bon UI, there are already preinstalled and configured components (which are called views). They have got methods to setup their looking. You can also create your own components easily: your component can depend on other components and use HTML and CSS power."),
                    code: new Image({ url: "./Images/components.png", altText: "Example" })
                })
            ])
                .setAlignment({ horizontal: Alignment.center, vertical: Alignment.center })
                .setMaxSize({ width: 900 })
                .setSize({ width: percents(100) })
        )
    }
}
