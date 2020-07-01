//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { View } from "../View.js"
import "../../jsdoc.js"

export class NavigationLink extends View {
    /**
     * @param {BodyOneChild} body                   link body
     * @param {*}            options
     * @param {View}         options.destination    view that will be opened when link was clicked
     */
    constructor (body, { destination } = {}) {
        super()
        
        /**
         * @var
         * @type {View}
         * Destination view
         */
        this.destination = destination
        
        /**
         * @var
         * @type {BodyOneChild}
         */
        this.item = body
    }

    body () {
        const result = typeof this.item === "function" ? this.item() : this.item

        if (!(result instanceof View || result instanceof VNode)) {
            throw new InvalidValueException(`Expected View or VNode as the child of NavigationLink, got ${getClass(result)}`)
        }

        return result
    }
}
