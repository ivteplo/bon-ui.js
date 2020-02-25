//
// HStack.js
// Created on 09/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"

/**
 * @public @class
 * @extends View
 */
export class HStack extends View {
    /**
     * @param {View[]} children 
     */
    constructor (children) {
        super()
        this.children = children
    }

    setAlignment ({ horizontal, vertical }) {
        if (horizontal instanceof String || typeof horizontal === "string") {
            this.styles.justifyContent = horizontal
        }

        if (vertical instanceof String || typeof vertical === "string") {
            this.styles.alignItems = vertical
        }

        return this
    }

    getBody () {
        var { children } = this

        if (!Array.isArray(children)) {
            children = children ? [children] : []
        }

        var vNode = super.getBody()
        vNode.tag = "div"
        vNode.body = children
        vNode.styles.display = "flex"
        
        return vNode
    }
}
