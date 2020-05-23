//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { HStack } from "./HStack"
import { Alignment, alignmentToCssValue } from "../../Values/Alignment"

/**
 * A view that represents vertical stack (column)
 * @class
 * @extends HStack
 */
export class VStack extends HStack {
    constructor (...args) {
        super(...args)
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
     *             new VStack([
     *                 new Text("Logo")
     *                     .font(Fonts.title.with({ size: 20 })),
     *                 new Text("Description")
     *                     .offset({ top: 20 })
     *             ]).alignment({ both: Alignment.center })
     *         )
     *     }
     * }
     */
    alignment ({ horizontal, vertical, both }) {
        if (Alignment.contains(both)) {
            this._styles.alignItems = alignmentToCssValue(both)
            this._styles.justifyContent = alignmentToCssValue(both)
        }

        if (Alignment.contains(horizontal)) {
            this._styles.alignItems = alignmentToCssValue(horizontal)
        }

        if (Alignment.contains(vertical)) {
            this._styles.justifyContent = alignmentToCssValue(vertical)
        }

        return this
    }

    body () {
        var vNode = super.body()
        vNode.styles.flexDirection = "column"
        
        return vNode
    }
}
