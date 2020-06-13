//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Control } from "../Generic/Control.js"
import { Colors } from "../../Values/Color.js"
import { Fonts } from "../../Values/Font.js"

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
        var { label: _label } = this.options

        var vNode = super.body()
        vNode.tag = "button"
        var label = _label instanceof Function ? _label() : _label

        if (!(label instanceof Function || label instanceof View)) {
            if (_label instanceof Function) {
                throw new Error("Getter of button label returned unexpected value. Expected view or virtual DOM node")
            } else {
                throw new Error("Unexpected button label passed. Expected view, virtual DOM node or getter")
            }
        }

        vNode.body = [ label ]
        vNode.attributes.type = "button"
        
        return vNode
    }
}
