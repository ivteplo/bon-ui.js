//
// Button.js
// Created on 26/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { Colors } from "../../Values/Color"
import { Fonts } from "../../Values/Font"

/**
 * @public @class
 * @extends View
 */
export class Button extends View {
    /**
     * @param {View} label 
     */
    constructor (label) {
        super()
        this.label = label
        this.styles.outline = "none"
        this.styles.cursor = "pointer"
        this.setOutline({ all: 0 })
            .setPadding({ all: 7 })
            .setFont(Fonts.inherit)
            .setBackground({ color: Colors.white })
            .setForeground({ color: Colors.ultramarineBlue })
    }

    getBody () {
        var { label } = this

        var vNode = super.getBody()
        vNode.tag = "button"
        vNode.body = [ label ]
        vNode.attributes.type = "button"
        
        return vNode
    }
}
