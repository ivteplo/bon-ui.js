//
// Alignment.js
// Created on 13/03/2020
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
export const Alignment = new Enum("start", "end", "center", "spaceAround", "spaceBetween", "shrink")

/**
 * @description A function to convert the Alignment enum item to css value
 * @param {Symbol} alignment 
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