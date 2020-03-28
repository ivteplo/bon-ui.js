//
// TextBox.js
// Created on 26/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { WhiteSpaceStyle, whiteSpaceStyleToCssValue } from "../../Values/WhiteSpaceStyle"
import { OutlineStyle } from "../../Values/OutlineStyle"
import { Positioning } from "../../Values/Positioning"
import { percents } from "../../Values/Length"
import { VNode } from "../../VirtualDOM/VNode"
import { Control } from "../Generic/Control"
import { Colors } from "../../Values/Color"
import { ZStack } from "../Layouts/ZStack"
import { Fonts } from "../../Values/Font"
import { Text } from "../Generic/Text"

/**
 * A view that represents the textbox
 * @class
 * @extends Control
 */
export class TextBox extends Control {
    /**
     * @param {Object}  options
     * @param {String}  [options.placeholder] Text that is shown inside the textbox when it is empty
     * @param {Boolean} [options.multiline]   Makes textbox one-lined or multilined
     */
    constructor ({ placeholder = "", multiline = false }) {
        super()
        this.placeholder = placeholder
        this.multiline = multiline
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
            .setWhiteSpaceStyle(this.multiline ? WhiteSpaceStyle.default : WhiteSpaceStyle.noWrap)
            .setSize({ width: 150 })
    }

    /**
     * A method to set the white space showing style
     * @param {Symbol} style A member of the WhiteSpaceStyle enum
     */
    setWhiteSpaceStyle(style) {
        if (WhiteSpaceStyle.contains(style)) {
            this.styles.whiteSpace = whiteSpaceStyleToCssValue(style)
        }

        return this
    }

    getInitialState() {
        var state = super.getInitialState()
        state.empty = true
        return state
    }

    getBody () {
        var result = (
            new ZStack([
                new VNode({
                    tag: "div",
                    attributes: {
                        contenteditable: true
                    },
                    styles: {
                        outline: "none",
                        border: "none",
                        width: "100%",
                        height: this.multiline ? "100%" : "1em",
                        whiteSpace: this.styles.whiteSpace
                    },
                    events: this.events
                }),
                new ZStack([
                    new Text(this.placeholder)
                        .setCSSProperty({ property: "overflow", value: "hidden" })
                        .setMaxSize({ width: percents(100) })
                        .setForeground({ color: Colors.lightGray })
                ])
                    .setPositioning({ type: Positioning.absolute, top: 0, left: 0 })
                    .setMaxSize({ width: percents(100) })
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
        
        result.styles = Object.assign(result.styles, this.styles)
        result.attributes = Object.assign(result.styles, this.attributes)

        return result
    }
}
