//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View, Media, Separator, Text, VStack, HStack, List, ScrollView, Colors, Fonts, Alignment, percents } from "../BonUI/BonUI.js"

var colors = Object.keys(Colors)

export class AppView extends View {
    body () {
        return (
            new ScrollView([
                new VStack([
                    new Text("This is title")
                        .font(Fonts.title),

                    new Text("This is subheading")
                        .offset({ top: 10 })
                        .font(Fonts.subheading),

                    new Text("This is monospace")
                        .offset({ top: 10 })
                        .font(Fonts.monospace),

                    new Media(
                        { prefersColorScheme: "dark" }, value => 
                        new Text(`You prefer a ${value ? "dark" : "light"} theme`)
                            .offset({ top: 10 })
                    ),

                    new Separator(),

                    new Text("Colors list")
                        .font(Fonts.title),

                    new List(colors, color => (
                        new HStack([
                            new Text(color),
                            new View()
                                .size({ width: 50, height: 50 })
                                .background({ color: Colors[color] })
                        ])
                        .alignment({ 
                            horizontal: Alignment.spaceBetween, 
                            vertical: Alignment.center 
                        })
                    )),
                ])
                .maxSize({ width: 600 })
                .size({ width: percents(100) })
            ])
            .scrollAxis({ vertical: true })
            .size({ width: percents(100) })
            .padding({ all: 20 })
            .alignment({ horizontal: Alignment.center })
        )
    }
}
