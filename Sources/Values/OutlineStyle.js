//
// OutlineStyle.js
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
export const OutlineStyle = new Enum("solid", "dashed", "dotted", "groove", "hidden", "ridge", "none")

/**
 * @description A function to convert the OutlineStyle enum item to css value
 * @param {Symbol} style 
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
