//
// VStack.js
// Created on 25/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { HStack } from "./HStack"

/**
 * @public @class
 * @extends HStack
 */
export class VStack extends HStack {
    constructor (...args) {
        super(...args)
    }

    setAlignment ({ horizontal, vertical }) {
        if (horizontal instanceof String || typeof horizontal === "string") {
            this.styles.alignItems = horizontal
        }

        if (vertical instanceof String || typeof vertical === "string") {
            this.styles.justifyContent = vertical
        }

        return this
    }

    getBody () {
        var vNode = super.getBody()
        vNode.styles.flexDirection = "column"
        
        return vNode
    }
}
