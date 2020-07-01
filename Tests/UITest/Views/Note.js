//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { View, Text, Row, Button, Color, Column, Font, Weight, Spacer } from "../../../Sources/BonUI/BonUI.js"
import { mainState } from "../MainState.js"

export class Note extends View {
    constructor (noteInfo) {
        super()
        this.info = noteInfo
    }

    deleteNote () {
        mainState.dispatch({
            type: "delete",
            id: this.info.id
        })
    }

    body () {
        const date = new Date(this.info.date)
        const dateString = date.toLocaleDateString() + " at " + date.toLocaleTimeString().slice(0, -3)

        return (
            new Row([
                new Column([
                    new Text(this.info.title)
                        .font(Font.default.with({
                            weight: Weight.medium
                        }))
                        .foregroundColor(Color.title),

                        new Text(dateString)
                            .font(Font.caption)
                ]),

                new Spacer(),
                    
                new Button(
                    new Text("Delete")
                        .foregroundColor(Color.red),
                    this.deleteNote.bind(this)
                )
            ], { spacing: 0 })
        )
    }
}
