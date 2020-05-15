//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
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
    alignment ({ horizontal, vertical }) {
        if (Alignment.contains(horizontal)) {
            this._styles.justifyContent = alignmentToCssValue(horizontal)
        }

        if (Alignment.contains(vertical)) {
            this._styles.alignItems = alignmentToCssValue(vertical)
        }

        return this
    }

    body () {
        var { children } = this

        if (!Array.isArray(children)) {
            children = children ? [children] : []
        }

        var vNode = super.body()
        vNode.tag = "div"
        vNode.body = children.filter(value => value != null)
        vNode.styles.display = "flex"
        
        return vNode
    }
}
