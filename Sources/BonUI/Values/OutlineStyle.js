//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"

/**
 * @enum
 * @property {Symbol} solid     Solid outline
 * @property {Symbol} dashed    Dashed outline
 * @property {Symbol} dotted    Dotted outline
 * @property {Symbol} groove    Outline with a carved appearance
 * @property {Symbol} hidden    No outline
 * @property {Symbol} ridge     Outline with an extruded appearance
 */
export const OutlineStyle = new Enum("solid", "dashed", "dotted", "groove", "hidden", "ridge")

/**
 * A function to convert the OutlineStyle enum item to css value
 * @param   {Symbol} style 
 * @returns {String} CSS `border-style` value
 */
export function outlineStyleToCssValue(style) {
    if (!OutlineStyle.contains(style)) {
        return undefined
    }

    switch (style) {
        default:
            return OutlineStyle.getIdentifier(style)
    }
}
