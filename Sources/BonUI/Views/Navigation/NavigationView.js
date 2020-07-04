//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { HorizontalAlignment } from "../../Values/Enums/Alignment.js"
import { FontModifier } from "../../Modifiers/FontModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { percents } from "../../Values/Length.js"
import { Spacer } from "../Generic/Spacer.js"
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

        navigationBarTitle.prependVNodeModifier(new FontModifier(Font.largeTitle))

        return (
            new Column([
                new Row([
                    /** @todo */
                ])
                .size({ height: 45 }),

                navigationBarTitle,
                
                this.item,

                new Spacer()
            ], { alignment: HorizontalAlignment.leading })
                .padding(20)
                .size({ width: percents(100) })
        )
    }
}