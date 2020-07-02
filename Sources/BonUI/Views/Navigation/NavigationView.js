//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { FontModifier } from "../../ViewModifiers/FontModifier.js"
import { VerticalAlignment } from "../../Values/Alignment.js"
import { getClass } from "../../Values/Helpers.js"
import { percents } from "../../Values/Length.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { Column } from "../Layouts/Column.js"
import { Font } from "../../Values/Font.js"
import { Row } from "../Layouts/Row.js"
import { View } from "../View.js"
import "../../jsdoc.js"

export class NavigationView extends View {
    /**
     * 
     * @param {BodyOneChild} item
     */
    constructor (item) {
        super()

        /**
         * @type {BodyOneChild}
         */
        this.item = item

        /**
         * @type {View|VNode}
         * Parent view or virtual DOM node
         */
        this.parent = null
    }

    /**
     * Method to navigate to another view
     * @param {View} view view to navigate to
     * @todo
     */
    navigateTo (view) {
        
    }

    body () {
        var navigationBarTitle = null

        if (this.item instanceof View && this.item._navigationBarTitle instanceof View) {
            let { _navigationBarTitle: title } = this.item
            navigationBarTitle = title
        }

        navigationBarTitle._vNodeModifiers.unshift(
            new FontModifier(Font.largeTitle)
        )

        return (
            new Column([
                new Row([
                    /** @todo */
                ]).size({ width: percents(100), height: 45 }),

                navigationBarTitle,
                
                this.item
            ], { alignment: VerticalAlignment.topLeading })
                .padding(20)
                .size({ width: percents(100) })
        )
    }
}