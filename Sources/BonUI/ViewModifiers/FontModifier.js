//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Font, textStyleToTagName } from "../Values/Font.js"
import { ViewModifier } from "./ViewModifier.js"
import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"

export class FontModifier extends ViewModifier {
    /**
     * @param {Font} font
     */
    constructor (font) {
        super()

        if (!(font instanceof Font)) {
            throw new InvalidValueException(`Expected Font instance as font, got ${font.constructor.name}`)
        }

        this.font = font
    }

    body (content) {
        return (
            new ContainerVNode({
                component: textStyleToTagName(this.font.textStyle),
                styles: {
                    font: this.font.toString()
                },
                body: content
            })
        )
    }
}
