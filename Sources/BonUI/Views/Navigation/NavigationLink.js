//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBodyItem } from "../../Values/Helpers.js"
import { NavigationView } from "./NavigationView.js"
import { View } from "../View.js"
import "../../jsdoc.js"

/**
 * View that makes {@link NavigationView} navigate to destination view when got clicked.
 * @example
 * new NavigationLink(
 *     new Button(
 *         new Text("Go to empty view")
 *     ),
 *     { destination: new EmptyView() }
 * )
 * @category Views
 * @subcategory Navigation
 */
export class NavigationLink extends View {
    /**
     * @param {BodyOneChild} body                   link body
     * @param {*}            options
     * @param {View}         options.destination    view that will be opened when link was clicked
     */
    constructor (body, { destination } = {}) {
        super()
        
        /**
         * @type {View}
         * Destination view
         */
        this.destination = destination
        
        /**
         * @type {BodyOneChild}
         */
        this.item = body

        this.onClick(() => {
            var { parent } = this
            
            while (parent && !(parent instanceof NavigationView)) {
                if (parent instanceof View) {
                    parent = parent.parent
                } else {
                    break
                }
            }
            
            if (!(parent instanceof NavigationView)) {
                return
            }

            parent.navigateTo(this.destination)
        })
    }

    get body () {
        return convertToViewBodyItem(this.item)
    }
}
