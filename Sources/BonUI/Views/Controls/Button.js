//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { Color } from "../../Values/Color.js"
import { Control } from "./Control.js"
import { View } from "../View.js"

export class Button extends Control {
    constructor (label, action = () => {}) {
        super()
        this.label = label
        this.action = typeof action === "function" ? action : () => {}
    }

    body () {
        var { label } = this
        var attributes = {
            type: "button"
        }

        if (!this.controlState.current.enabled) {
            attributes.disabled = "disabled"
        }

        if (typeof label === "function") {
            label = label()
        }

        if (!(label instanceof View)) {
            throw new InvalidValueException(`Expected view as a label, got ${
                typeof label === "object" ? label.constructor.name : typeof label}`)
        }

        return new ContainerVNode({
            component: "button",
            attributes,
            styles: {
                background: "none",
                color: !attributes.disabled ? "cornflowerblue" : Color.gray,
                outline: "none",
                border: "0",
                fontSize: "1em",
                cursor: "pointer"
            },
            handlers: {
                click: [ this.action ]
            },
            body: [ label ]
        })
    }
}
