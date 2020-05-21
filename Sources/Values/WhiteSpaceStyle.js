//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum"

/**
 * @enum
 * @property {Symbol} default       Default whitespace showing style (multiple whitespaces become one space)
 * @property {Symbol} code          No whitespace characters are ignored 
 * @property {Symbol} codeWrap      No whitespace characters are ignored and the text wraps when it does not fit the parent
 * @property {Symbol} codeLine      Tabs are ignored
 * @property {Symbol} noWrap        Like default but the text does not wrap
 */
export const WhiteSpaceStyle = new Enum("default", "code", "codeWrap", "codeLine", "noWrap")

/**
 * A function to convert the FitType enum item to css value
 * @param   {Symbol} type
 * @returns {String} CSS `white-space` value
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
        case WhiteSpaceStyle.noWrap:
            return "nowrap"
    }
}
