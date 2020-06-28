//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"

/**
 * @enum     {Symbol}
 * @property {Symbol} start
 * @property {Symbol} center
 * @property {Symbol} end
 */
export const Alignment = new Enum("start", "center", "end")

/**
 * Method to convert `Alignment` enum item to CSS flexbox `justify-content`/`align-items` value
 * @param {Symbol} alignment `Alignment` enum item
 */
export function alignmentToCSSFlexBoxAlignment (alignment) {
    switch (alignment) {
        case Alignment.start:
            return "flex-start"
        case Alignment.center:
            return "center"
        case Alignment.end:
            return "flex-end"
    }
}
