//
// TextBox.js
// Created on 26/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { Length, Measure } from "../../Values/Length"
import { OutlineStyle } from "../../Values/OutlineStyle"
import { Positioning } from "../../Values/Positioning"
import { VNode } from "../../VirtualDOM/VNode"
import { Control } from "../Generic/Control"
import { Colors } from "../../Values/Color"
import { ZStack } from "../Layouts/ZStack"
import { Fonts } from "../../Values/Font"
import { Text } from "../Generic/Text"

/**
 * @public @class
 * @extends Control
 */
export class TextBox extends Control {
    /**
     * @param {string} placeholder
     */
    constructor (placeholder = "") {
        super()
        this.placeholder = placeholder
        this.styles.outline = "none"
        this.setOutline({ all: 1, color: Colors.lightGray, style: OutlineStyle.solid, radius: 7 })
            .setPadding({ all: 7 })
            .setFont(Fonts.inherit)
            .setSize({ width: 210 })
            .setBackground({ color: Colors.white })
            .setForeground({ color: Colors.black })
            .setCSSProperty({ property: "overflow", value: "hidden" })
            .setHandlerFor({ event: "input", handler: eventInfo => {
                if ((eventInfo.target.innerText === "") !== this.state.get("empty")) {
                    this.state.set("empty", eventInfo.target.innerText === "")
                }
            }})
    }

    getInitialState() {
        var state = super.getInitialState()
        state.empty = true
        return state
    }

    getBody () {
        var { label } = this

        var vNode = super.getBody()
        vNode.tag = "div"
        vNode.attributes.contenteditable = "true"

        return (
            new ZStack([
                vNode,
                new ZStack([
                    new Text(this.placeholder)
                        .setCSSProperty({ property: "overflow", value: "hidden" })
                        .setMaxSize({ width: new Length(100, Measure.percent) })
                        .setForeground({ color: Colors.lightGray })
                ])
                    .setPositioning({ type: Positioning.absolute, top: 0, left: 0 })
                    .setMaxSize({ width: new Length(100, Measure.percent) })
                    .setPadding({ 
                        left: this.styles.paddingLeft || this.styles.padding, 
                        top: this.styles.paddingTop || this.styles.padding,
                        right: this.styles.paddingRight || this.styles.padding,
                        bottom: this.styles.paddingBottom || this.styles.padding
                    })
                    .setCSSProperty({ property: "pointerEvents", value: "none" })
                    .setCSSProperty({ property: "boxSizing", value: "border-box" })
                    .setCSSProperty({ property: "display", value: (this.state.get("empty") ? "block" : "none") })
            ])
        )
    }
}
