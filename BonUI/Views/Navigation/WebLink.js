//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { convertToViewBodyItem } from "../../Values/Helpers.js"
import { Application } from "../../Application/Application.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { Color } from "../../Values/Color.js"
import { View } from "../View.js"
import "../../jsdoc.js"

/**
 * View that opens the link on the web.
 * @example
 * new Link(
 *     new Text("Our Github Repo")
 * , { url: "https://github.com/teplovs/bon-ui" })
 * @category Views
 * @subcategory Navigation
 */
export class WebLink extends View {
    /**
     * @param {BodyOneChild} body           link body
     * @param {*}            options
     * @param {View}         options.url    link that will be opened
     */
    constructor (body, { url } = {}) {
        super()
        
        try {
            let linkURL = new URL(url)
        } catch (error) {
            throw new InvalidValueException(`"${url}" is not a valid URL`)
        }

        /**
         * @type {View}
         * Link to open
         */
        this.url = String(url)
        
        /**
         * @type {BodyOneChild}
         */
        this.item = body
    }

    get body () {
        return new VNode("a", {
            attributes: {
                href: this.url,
                target: "_blank"
            },
            styles: {
                color: (
                    Application.shared && Application.shared.mainColor 
                        ? Application.shared.mainColor 
                        : Color.blue
                ),
                textDecoration: "none",
                display: "block"
            },
            body: [
                convertToViewBodyItem(this.item)
            ]
        })
    }
}
