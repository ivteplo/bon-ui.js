//
// Text.js
// Created on 08/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { VNode } from "../../VirtualDOM/VNode"
import { Font, textStyleToTagName, TextStyle } from "../../Values/Font"
import { Alignment, textAlignmentToCssValue } from "../../Values/Alignment"
import { WhiteSpaceStyle, whiteSpaceStyleToCssValue } from "../../Values/WhiteSpaceStyle"

/**
 * A class that is used to represent the text
 * @class
 * @extends View
 */
export class Text extends View {
    /**
     * @param {string} text 
     */
    constructor (text) {
        super()
        this.text = text
        this.setSelectableTo(false)
        this.styles.margin = 0
        this.styles.padding = 0
    }

    /**
     * A method to set the text alignment
     * @param {Symbol} alignment Item of the Alignment enum
     */
    setAlignment(alignment) {
        if (Alignment.contains(alignment)) {
            this.styles.textAlign = textAlignmentToCssValue(alignment)
        }

        return this
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
        var tag = "p"

        if (this.styles.font instanceof Font && TextStyle.contains(this.styles.font.textStyle)) {
            tag = textStyleToTagName(this.styles.font.textStyle)
        }

        var body = this.text.split("\n").map(val => {
            return [
                new VNode({
                    text: val
                }),
                new VNode({
                    tag: "br"
                })
            ]
        }).reduce((prev, next) => prev.concat(next)).slice(0, -1)

        var vNode = super.getBody()
        vNode.tag = tag
        vNode.body = body

        return vNode
    }
}
