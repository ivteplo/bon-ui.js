//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum"

/**
 * @enum
 * @property {Symbol} relative      Position the object relative to itself
 * @property {Symbol} absolute      Position the object relative to the parent with `relative` positioning
 * @property {Symbol} fixed         Position the object relative to the browser viewport
 * @property {Symbol} sticky        Position the object to make it "stick" to the specified position when scrolling
 * @property {Symbol} static        Default positioning
 */
export const Positioning = new Enum("relative", "absolute", "fixed", "sticky", "static")

/**
 * A function to convert the Positioning enum item to css value
 * @param   {Symbol} positioning 
 * @returns {String} CSS `position` value
 */
export function positioningToCssValue(positioning) {
    if (!Positioning.contains(positioning)) {
        return undefined
    }

    switch (positioning) {
        default:
            return Positioning.getIdentifier(positioning)
    }
}
