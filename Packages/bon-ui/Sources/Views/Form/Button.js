//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Control } from "../Generic/Control"
import { Colors } from "../../Values/Color"
import { Fonts } from "../../Values/Font"

/**
 * A view that represents the button
 * @class
 * @extends Control
 */
export class Button extends Control {
    /**
     * @param {View} label The label inside the button
     */
    constructor (label) {
        super({ label })
        this.outline({ all: 0 })
            .applyCSS({ cursor: "pointer" })
            .padding({ all: 7 })
            .font(Fonts.inherit)
            .background({ color: Colors.white })
            .foreground({ color: Colors.ultramarineBlue })
    }

    body () {
        var { label } = this.options

        var vNode = super.body()
        vNode.tag = "button"
        vNode.body = [ label ]
        vNode.attributes.type = "button"
        
        return vNode
    }
}
