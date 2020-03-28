//
// Positioning.js
// Created on 23/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
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
