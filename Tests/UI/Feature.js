//
// Feature.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, VStack, Image, Text, Alignment, FitType, Length, Measure, HStack, Weight, percents } from "../../Sources/BonUI"
import { Colors, Fonts } from "./Config"

export class Feature extends View {
    constructor({ heading, description, code }) {
        super()

        this.heading = heading
        this.description = description
        this.code = code
    }

    getBody() {
        var { code, heading, description } = this

        return (
            new VStack([
                heading
                    .setFont(Fonts.title.with({ weight: Weight.bold }))
                    .setOffset({ bottom: 20 }),
                description
                    .setOffset({ bottom: 20 })
                    .setMaxSize({ width: 900 }),
                code
                    .setCSSProperty({ property: "boxShadow", value: "0 7px 14px " + Colors.black.withAlpha(0.2).toString() })
                    .setSize({ width: percents(100) })
                    .setMinSize({ width: 270 })
                    .setMaxSize({ width: 900 })
            ])
                .setAlignment({ horizontal: Alignment.start, vertical: Alignment.center })
                .setPadding({ all: 10 })
        )
    }
}
