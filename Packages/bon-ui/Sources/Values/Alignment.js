//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum"

/**
 * The enum that is used to set the alignment type of some of the views.
 * @enum
 * @property {Symbol} start             Aligns the items to the start 
 * @property {Symbol} end               Aligns the items to the end
 * @property {Symbol} center            Aligns the items to the center
 * @property {Symbol} spaceAround       Aligns the items the way that there is the space between them and between start/end 
 * @property {Symbol} spaceBetween      Aligns the items the way that there is the space between them
 * @property {Symbol} shrink            Aligns the items to make the items the same size (width or height)
 */
export const Alignment = new Enum("start", "end", "center", "spaceAround", "spaceBetween", "shrink")

/**
 * A function to convert the Alignment enum item to css value
 * @param {Symbol} alignment An item of the `Alignment` enum
 * @returns {String} CSS value of the `justify-content` or `align-items` property
 */
export function alignmentToCssValue(alignment) {
    if (!Alignment.contains(alignment)) {
        return undefined
    }

    switch (alignment) {
        case Alignment.start:
            return "flex-start"
        case Alignment.end:
            return "flex-end"
        case Alignment.center:
            return "center"
        case Alignment.spaceAround:
            return "space-around"
        case Alignment.spaceBetween:
            return "space-between"
        case Alignment.shrink:
            return "shrink"
    }
}

/**
 * A function to convert the Alignment enum item to css value
 * @param {Symbol} alignment An item of the `Alignment` enum
 * @returns {String} CSS value of the `text-align` property
 */
export function textAlignmentToCssValue(alignment) {
    if (!Alignment.contains(alignment)) {
        return undefined
    }

    switch (alignment) {
        case Alignment.start:
            return "left"
        case Alignment.end:
            return "right"
        case Alignment.center:
            return "center"
        case Alignment.shrink:
        case Alignment.spaceAround:
        case Alignment.spaceBetween:
            return "justify"
    }
}
