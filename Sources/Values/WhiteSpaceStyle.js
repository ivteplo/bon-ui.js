//
// WhiteSpaceStyle.js
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
export const WhiteSpaceStyle = new Enum("default", "code", "codeWrap", "codeLine")

/**
 * @description A function to convert the FitType enum item to css value
 * @param {Symbol} type
 */
export function whiteSpaceStyleToCssValue(type) {
    if (!WhiteSpaceStyle.contains(type)) {
        return undefined
    }

    switch (type) {
        case WhiteSpaceStyle.default:
            return "normal"
        case WhiteSpaceStyle.code:
            return "pre"
        case WhiteSpaceStyle.codeWrap:
            return "pre-wrap"
        case WhiteSpaceStyle.codeLine:
            return "pre-line"
    }
}