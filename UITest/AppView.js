//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View, FitType, Media, TextBox, Image, Separator, Text, VStack, HStack, ZStack, List, ScrollView, Colors, Fonts, Positioning, Alignment, Axis, percents, parentFontSize } from "../BonUI/BonUI.js"

var colors = Object.keys(Colors)

class Example extends View {
    constructor (title, contents) {
        super({ title, contents })
    }

    body () {
        return (
            new VStack([
                new Text(this.options.title)
                    .font(Fonts.title),
                this.options.contents
            ])
        )
    }
}

export class AppView extends View {
    body () {
        return (
            new ScrollView([
                new VStack([
                    new Text("This is large title")
                        .font(Fonts.largeTitle),

                    new Text("This is title")
                        .font(Fonts.title),

                    new Text("This is subheading")
                        .font(Fonts.subheading),

                    new Text("This is monospace")
                        .font(Fonts.monospace),

                    new Media({ prefersColorScheme: "dark" }, value =>
                        new Text(`You are using the ${value ? "dark" : "light"} theme`)
                    ),

                    new Separator(),

                    new Example("VStack", (
                        new VStack([
                            new Text("Logo")
                                .offset({ bottom: 10 }),
                            new Text("Description")
                        ])
                    )),

                    new Separator(),

                    new Example("HStack", (
                        new HStack([
                            new Text("Logo")
                                .offset({ right: 10 }),
                            new Text("Description")
                        ])
                    )),

                    new Separator(),

                    new Example("ZStack", (
                        new ZStack([
                            new Text("Layer 1")
                                .background({ color: Colors.theme.orange })
                                .foreground({ color: Colors.white })
                                .padding({ all: 25 })
                                .positioning({ type: Positioning.absolute, top: 0, left: 0, right: 50 }),
                            new Text("Layer 2")
                                .background({ color: Colors.gray })
                                .foreground({ color: Colors.white })
                                .padding({ all: 25 })
                                .offset({ left: 50, top: 50 })
                        ])
                    )),

                    new Separator(),

                    new Example("Vertical separator", (
                        new HStack(() => [
                            new Text("Item #1"),
                            new Separator(Axis.vertical),
                            new Text("Item #2"),
                            new Separator(Axis.vertical),
                            new Text("Item #3"),
                            new Separator(Axis.vertical),
                            new Text("Item #4"),
                        ])
                    )),

                    new Separator(),

                    new Example("Image", (
                        new Image({ url: "/logo.png", altText: "Bon UI Logo" })
                            .fitType(FitType.contain)
                            .size({ width: 250, height: 250 })
                    )),

                    new Separator(),

                    new Example("Textbox", [
                        new TextBox()
                            .offset({ bottom: 20 }),

                        new TextBox({ placeholder: "Your name" })
                            .offset({ bottom: 20 }),

                        new TextBox({ placeholder: "Your message", multiline: true })
                    ]),

                    new Separator(),

                    new Example("Colors list", (
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
                        ))
                    ))
                ])
                .maxSize({ width: 600 })
                .size({ width: percents(100) })
            ])
            .scrollAxis(Axis.vertical)
            .size({ width: percents(100) })
            .padding({ all: 20 })
            .alignment({ horizontal: Alignment.center })
        )
    }
}
