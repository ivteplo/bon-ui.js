//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View"
import { VNode } from "../../VirtualDOM/VNode"
import { Font, textStyleToTagName, TextStyle } from "../../Values/Font"
import { Alignment, textAlignmentToCssValue } from "../../Values/Alignment"
import { WhiteSpaceStyle, whiteSpaceStyleToCssValue } from "../../Values/WhiteSpaceStyle"

var defaultSelectable = false

/**
 * A class that is used to represent the text
 * @class
 * @extends View
 */
export class Text extends View {
    /**
     * A method to set the default value of selectable to specified (If selectable is true then you can select the text, else you can not)
     * @param {Boolean} value Value that will be set as default
     */
    static setDefaultSelectableTo(value) {
        if (value instanceof Boolean || typeof value === "boolean") {
            defaultSelectable = Boolean(value)
        }
    }

    /**
     * @param {string} text 
     */
    constructor (text) {
        super({ text })
        this.selectable(defaultSelectable)
            .offset({ all: 0 })
            .padding({ all: 0 })
    }

    /**
     * A method to set the text alignment
     * @param {Symbol} alignment Item of the Alignment enum
     */
    alignment(alignment) {
        if (Alignment.contains(alignment)) {
            this._styles.textAlign = textAlignmentToCssValue(alignment)
        }

        return this
    }

    /**
     * A method to set the text white space showing style
     * @param {Symbol} style Item of the WhiteSpaceStyle enum
     */
    whiteSpaceStyle(style) {
        if (WhiteSpaceStyle.contains(style)) {
            this._styles.whiteSpace = whiteSpaceStyleToCssValue(style)
        }
        
        return this
    }

    body () {
        var tag = "p"

        if (this._styles.font instanceof Font && TextStyle.contains(this._styles.font.textStyle)) {
            tag = textStyleToTagName(this._styles.font.textStyle)
        }

        var body = String(this.options.text).split("\n").map(val => {
            return [
                new VNode({
                    text: val
                }),
                new VNode({
                    tag: "br"
                })
            ]
        }).reduce((prev, next) => prev.concat(next)).slice(0, -1)

        var vNode = super.body()
        vNode.tag = tag
        vNode.body = body

        return vNode
    }
}
