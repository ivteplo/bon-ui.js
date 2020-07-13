//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { View, Text, NavigationView, Section, TextField, Row, Button, Column, Font, List } from "../../../esm/BonUI.development.js"
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
        if (!this.textField || !this.textField.value) {
            return
        }

        mainState.dispatch({
            type: "add",
            title: this.textField.value,
            date: Date.now()
        })

        this.textField.resetValue()
    }

    get body () {
        return (
            new NavigationView(
                new Column([
                    new Section(
                        new Text("What's next?"),

                        new Row([
                            new TextField({ placeholder: "Do the homework" }, this.onUserInput.bind(this)),

                            new Button(new Text("+"), this.addButtonClicked.bind(this))
                                .size({ width: 40 })
                                .padding()
                                .font(Font.text.with({ size: 25 }))
                        ])
                    ),

                    new Section(
                        new Text("Notes"),

                        new List(mainState.current.notes, note => 
                            new Note(note))
                    )
                ])
                .navigationBarTitle(new Text("Bon UI Notes"))
            )
            .maxSize({ width: 500 })
        )
    }
}
