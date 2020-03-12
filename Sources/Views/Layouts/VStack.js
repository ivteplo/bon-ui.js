//
// VStack.js
// Created on 25/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { HStack } from "./HStack"
import { Alignment, alignmentToCssValue } from "../../Values/Alignment"

/**
 * @public @class
 * @extends HStack
 */
export class VStack extends HStack {
    constructor (...args) {
        super(...args)
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
            this.styles.alignItems = alignmentToCssValue(horizontal)
        }

        if (Alignment.contains(vertical)) {
            this.styles.justifyContent = alignmentToCssValue(vertical)
        }

        return this
    }

    getBody () {
        var vNode = super.getBody()
        vNode.styles.flexDirection = "column"
        
        return vNode
    }
}
