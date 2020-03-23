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
 * @public @enum
 */
export const Positioning = new Enum("relative", "absolute", "fixed", "sticky", "static")

/**
 * @description A function to convert the Positioning enum item to css value
 * @param {Symbol} positioning 
 */
export function positioningToCssValue(positioning) {
    if (!Positioning.contains(positioning)) {
        return undefined
    }

    switch (positioning) {
        case Positioning.relative:
            return "relative"
        case Positioning.absolute:
            return "absolute"
        case Positioning.fixed:
            return "fixed"
        case Positioning.sticky:
            return "sticky"
        case Positioning.static:
            return "static"
    }
}
