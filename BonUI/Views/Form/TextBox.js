//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { WhiteSpaceStyle, whiteSpaceStyleToCssValue } from "../../Values/WhiteSpaceStyle.js"
import { OutlineStyle } from "../../Values/OutlineStyle.js"
import { Control } from "../Generic/Control.js"
import { Colors } from "../../Values/Color.js"
import { Fonts } from "../../Values/Font.js"

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
        super({ placeholder, multiline })

        this.outline({ all: 1, color: Colors.lightGray, style: OutlineStyle.solid, radius: 7 })
            .padding({ all: 7 })
            .font(Fonts.inherit)
            .background({ color: Colors.white })
            .foreground({ color: Colors.black })
            .applyCSS({ resize: "none", outline: "none" })
            .setAttributes({ placeholder: this.options.placeholder })
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
        var result = super.body()
        result.tag = (this.options.multiline ? "textarea" : "input")
        return result
    }

    // DEPRECATED METHODS
    // they are still here to make the old apps be able to work for some time before they migrate
    /**
     * @deprecated
     */
    setWhiteSpaceStyle(...args) {
        console.warn("Method `setWhiteSpaceStyle` is deprecated. Please, start using new method `whiteSpaceStyle`.")
        return this.whiteSpaceStyle(...args)
    }
}
