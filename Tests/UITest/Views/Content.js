//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { View, Text, NavigationView, Section, TextField, Row, Button, Color, Column, Font, pixels } from "../../../Sources/BonUI/BonUI.js"
import { mainState } from "../MainState.js"
import { Note } from "./Note.js"


export class Content extends View {
    constructor () {
        super()
        /**
         * @type {TextField}
         */
        this.textField = null

        mainState.subscribe(() => {
            this.update()
        })
    }
    
    onUserInput (textField) {
        this.textField = textField
    }

    addButtonClicked () {
        if (!this.textField) {
            return
        }

        mainState.dispatch({
            type: "add",
            title: this.textField.value,
            date: Date.now()
        })

        this.textField.resetValue()
    }

    body () {
        return (
            new NavigationView([
                new Section(
                    new Text("What's next?"),

                    new Row([
                        new TextField({ placeholder: "Do the homework" }, this.onUserInput.bind(this)),

                        new Button(new Text("+"), this.addButtonClicked.bind(this))
                            .size({ width: pixels(40) })
                            .padding()
                            .font(Font.default.with({
                                size: pixels(25)
                            }))
                            .foregroundColor(Color.orange)
                    ])
                ),

                new Section(
                    new Text("Notes"),

                    new Column(
                        mainState.current.notes
                            .map(note => new Note(note))
                    )
                )
            ])
            .navigationBarTitle(new Text("Bon UI Notes"))
        )
    }
}
