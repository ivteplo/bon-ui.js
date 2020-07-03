//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewVNodeModifier } from "./ViewVNodeModifier.js"
import { Font, TextStyle } from "../Values/Font.js"
import { Color } from "../Values/Color.js"

export class FontModifier extends ViewVNodeModifier {
    /**
     * @param {Font} font font to use
     */
    constructor (font) {
        super()

        if (!(font instanceof Font)) {
            throw new InvalidValueException(`Expected Font instance as the font parameter`)
        }

        this.font = font
    }

    body (content) {
        const styles = {
            font: this.font.toString()
        }

        const optionalStyles = {}
        const textStyleString = TextStyle.getIdentifier(this.font.textStyle)

        if (textStyleString in Color) {
            optionalStyles.color = Color[textStyleString]
        }

        content.styles = Object.assign(optionalStyles, content.styles, styles)
        return content
    }
}