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
     * A method to set the alignment to the specific type
     * @param {Object} options
     * @param {Symbol} options.horizontal   Item of the Alignment enum
     * @param {Symbol} options.vertical     Item of the Alignment enum
     */
    alignment ({ horizontal, vertical }) {
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
