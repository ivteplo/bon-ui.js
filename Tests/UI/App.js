//
// App.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View, Color, Enum, Button, HStack, VStack, ZStack, List, Colors, normalizeDocumentStyles, Fonts, Text, Link, Canvas, OutlineStyle, Alignment } from "../../Sources/BonUI"

normalizeDocumentStyles({ flexBody: true })

var position = {x: 0, y: 0}

class App extends View {
    getInitialState () {
        return {}
    }

    getBody () {
        return (
            new VStack([
                new Canvas()
                    .setPaintHandler((context, canvas, view) => {
                        const relativePosition = Object.assign({}, position)
                        const boundingClientRect = canvas.getBoundingClientRect()
                        relativePosition.x -= boundingClientRect.left
                        relativePosition.y -= boundingClientRect.top

                        context.beginPath()
                        context.arc(relativePosition.x, relativePosition.y, 35, 0, Math.PI * 2)
                        context.fillStyle = Colors.vividOrangePeel.toString()
                        context.fill()
                        context.closePath()

                        requestAnimationFrame(() => view.forceInvalidate())
                    })
                    .setOutline({ all: 2, color: Colors.vividOrangePeel, style: OutlineStyle.solid })
                    .setHandlerFor({ event: "touchmove", handler: event => {
                        position.x = event.touches[0].clientX
                        position.y = event.touches[0].clientY
                    }})
                    .setHandlerFor({ event: "mousemove", handler: event => {
                        position.x = event.clientX
                        position.y = event.clientY
                    }})
            ])
                .setAlignment({ horizontal: Alignment.center })
        )
    }
}

window.Enum = Enum

const app = new App()
app.mountTo(document.body)
