//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBodyItem } from "../../Values/Helpers.js"
import { Application } from "../../Application/Application.js"
import { FocusableControl } from "./FocusableControl.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { Color } from "../../Values/Color.js"
import "../../jsdoc.js"

export class Button extends FocusableControl {
    /**
     * 
     * @param {BodyOneChild} label 
     * @param {function}     action 
     */
    constructor (label, action = () => {}) {
        super()
        this.label = label
        this.action = typeof action === "function" ? action : () => {}
        this.onClick(this.action)
    }

    get body () {
        var label = convertToViewBodyItem(this.label)

        var attributes = {
            type: "button"
        }

        if (!this.controlState.current.enabled) {
            attributes.disabled = "disabled"
        }

        return new VNode("button", {
            attributes,
            styles: {
                color: !attributes.disabled ? (
                    Application.shared && Application.shared.mainColor 
                        ? Application.shared.mainColor 
                        : Color.blue
                    ) : Color.secondary
            },
            body: [
                label
            ]
        })
    }
}
