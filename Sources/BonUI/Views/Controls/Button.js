//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { convertToViewBodyItem } from "../../Values/Helpers.js"
import { FocusableControl } from "./FocusableControl.js"
import { Color } from "../../Values/Color.js"
import "../../jsdoc.js"

export class Button extends FocusableControl {
    /**
     * 
     * @param {BodyOneItem} label 
     * @param {function}    action 
     */
    constructor (label, action = () => {}) {
        super()
        this.label = label
        this.action = typeof action === "function" ? action : () => {}
        this.onClick(this.action)
    }

    body () {
        var label = convertToViewBodyItem(this.label)

        var attributes = {
            type: "button"
        }

        if (!this.controlState.current.enabled) {
            attributes.disabled = "disabled"
        }

        return new ContainerVNode({
            component: "button",
            attributes,
            styles: {
                color: !attributes.disabled ? Color.blue : Color.gray
            },
            body: [ label ]
        })
    }
}
