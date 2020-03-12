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
import { Alignment, alignmentToCssValue } from "../../Values/Alignment"

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

    /**
     * 
     * @param {{
     *  horizontal: Symbol,
     *  vertical: Symbol
     * }} param0 
     */
    setAlignment ({ horizontal, vertical }) {
        if (Alignment.contains(horizontal)) {
            this.styles.justifyContent = alignmentToCssValue(horizontal)
        }

        if (Alignment.contains(vertical)) {
            this.styles.alignItems = alignmentToCssValue(vertical)
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
