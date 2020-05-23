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
     * A method to set the alignment to the specific type (use Alignment enum items)
     * @param {Object} options
     * @param {Symbol} options.horizontal   alignment on the horizontal axis
     * @param {Symbol} options.vertical     alignment on the vertical axis
     * @param {Symbol} options.both         alignment on the vertical and horizontal axises
     * @example
     * class ExampleView extends View {
     *     body () {
     *         return (
     *             new HStack([
     *                 new Text("Logo")
     *                     .font(Fonts.title.with({ size: 20 })),
     *                 new Text("Description")
     *                     .offset({ left: 20 })
     *             ]).alignment({ both: Alignment.center })
     *         )
     *     }
     * }
     */
    alignment ({ horizontal, vertical, both }) {
        if (Alignment.contains(both)) {
            this._styles.justifyContent = alignmentToCssValue(both)
            this._styles.alignItems = alignmentToCssValue(both)
        }
        
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
