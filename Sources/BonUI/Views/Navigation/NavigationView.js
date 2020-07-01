//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { FontModifier } from "../../ViewModifiers/FontModifier.js"
import { VerticalAlignment } from "../../Values/Alignment.js"
import { getClass } from "../../Values/Helpers.js"
import { percents } from "../../Values/Length.js"
import { Column } from "../Layouts/Column.js"
import { Font } from "../../Values/Font.js"
import { Row } from "../Layouts/Row.js"
import { View } from "../View.js"
import "../../jsdoc.js"

export class NavigationView extends View {
    /**
     * 
     * @param {Body} items 
     */
    constructor (items) {
        super()

        /**
         * @type {Body}
         */
        this.items = items

        /**
         * @private @type {View}
         * Title in the navigation bar
         */
        this._navigationBarTitle = null
    }

    navigationBarTitle (title) {
        if (!(title instanceof View)) {
            throw new InvalidValueException(`Expected View instance as navigation bar title, got ${getClass(title)}`)
        }

        this._navigationBarTitle = title

        this._navigationBarTitle._vNodeModifiers.unshift(
            new FontModifier(Font.largeTitle)
        )

        return this
    }

    body () {
        return (
            new Column([

                new Row([
                    /** @todo */


                ]).size({ width: percents(100), height: 45 }),

                this._navigationBarTitle,
                
                new Column([
                    this.items
                ])
                
            ], { alignment: VerticalAlignment.topLeading })
                .padding(20)
                .size({ width: percents(100) })
        )
    }
}