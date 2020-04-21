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
            .setBackground({ color: Colors.white })
            .setForeground({ color: Colors.black })
            .applyCSS({ resize: "none", outline: "none" })
            .setAttributes({ placeholder: this.placeholder })
    }

    /**
     * A method to set the text white space showing style
     * @param {Symbol} style Item of the WhiteSpaceStyle enum
     */
    setWhiteSpaceStyle(style) {
        if (WhiteSpaceStyle.contains(style)) {
            this.styles.whiteSpace = whiteSpaceStyleToCssValue(style)
        }
        
        return this
    }

    getBody () {
        var result = super.getBody()
        result.tag = (this.multiline ? "textarea" : "input")
        return result
    }
}
