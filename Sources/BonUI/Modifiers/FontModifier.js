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

        switch (this.font.textStyle) {
            case TextStyle.text:
            case TextStyle.monospace:
                break
            case TextStyle.largeTitle:
            case TextStyle.title:
            case TextStyle.subheading:
                optionalStyles.color = Color.primary
                break
            case TextStyle.sectionTitle:
            case TextStyle.caption:
                optionalStyles.color = Color.secondary
                break
        }

        content.styles = Object.assign(optionalStyles, content.styles, styles)
        return content
    }
}