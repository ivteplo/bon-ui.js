//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { Colors } from "../../Values/Color.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { Font, textStyleToTagName, TextStyle } from "../../Values/Font.js"
import { Alignment, textAlignmentToCssValue } from "../../Values/Alignment.js"
import { WhiteSpaceStyle, whiteSpaceStyleToCssValue } from "../../Values/WhiteSpaceStyle.js"

var defaultSelectable = false

/**
 * A class that is used to represent the text
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
        super({ text: String(text) })

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

        if (!this._styles.color) {
            let color = Colors.theme.quaternaryLabel
            switch (tag) {
                case "h1":
                    color = Colors.theme.label
                    break
                case "h2":
                    color = Colors.theme.secondaryLabel
                    break
                case "h3":
                    color = Colors.theme.tertiaryLabel
                    break
                default:
                    break
            }

            vNode.styles.color = color.toString()
        }

        return vNode
    }

    // DEPRECATED METHODS
    // they are still here to make the old apps be able to work for some time before they migrate
    /**
     * @deprecated
     */
    setAlignment(...args) {
        console.warn("Method `setAlignment` is deprecated. Please, start using new method `alignment`.")
        return this.alignment(...args)
    }

    /**
     * @deprecated
     */
    setWhiteSpaceStyle(...args) {
        console.warn("Method `setWhiteSpaceStyle` is deprecated. Please, start using new method `whiteSpaceStyle`.")
        return this.whiteSpaceStyle(...args)
    }
}

