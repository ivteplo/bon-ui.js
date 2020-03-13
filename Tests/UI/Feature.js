//
// Feature.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, VStack, Image, Text, Alignment, Fonts, FitType, Length, Measure, HStack } from "../../Sources/BonUI"
import { Colors } from "./Config"

export class Feature extends View {
    constructor({ heading, description, code }) {
        super()

        this.heading = heading
        this.description = description
        this.code = code
    }

    getInitialState() {
        return {}
    }

    getBody() {
        var { code, heading, description } = this

        return (
            new VStack([
                heading
                    .setFont(Fonts.subheading)
                    .setOffset({ bottom: 20 })
                    .setForeground({ color: Colors.brown }),
                description
                    .setOffset({ bottom: 20 }),
                code
            ])
                .setAlignment({ horizontal: Alignment.center, vertical: Alignment.center })
                .setPadding({ all: 10 })
        )
    }
}
