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
 * A view that represents the horizontal stack (row)
 * @class
 * @extends View
 */
export class HStack extends View {
    /**
     * @param {Array<View|VNode>} children The items of the stack
     */
    constructor (children) {
        super()
        this.children = children
    }

    /**
     * A method to set the alignment to the specific type
     * @param {Object} options
     * @param {Symbol} options.horizontal   Item of the Alignment enum
     * @param {Symbol} options.vertical     Item of the Alignment enum
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
        vNode.body = children.filter(value => value != null)
        vNode.styles.display = "flex"
        
        return vNode
    }
}
