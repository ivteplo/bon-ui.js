//
// Font.js
// Created on 08/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { Enum } from "./Enum"
import { Length, Measure } from "./Length"

/**
 * @public @enum
 */
export const TextStyle = new Enum("default", "largeTitle", "title", "headline", "subheadline", "callout", "footnote", "caption")

/**
 * @public @enum
 */
export const Weight = new Enum("regular", "ultraLight", "thin", "light", "medium", "semibold", "bold", "heavy", "black")

/**
 * @public @class
 * @description A class to describe which font to use for the component
 */
export class Font {
    /**
     * 
     * @param {{
     *  name?: string,
     *  textStyle?: string,
     *  size?: Length|number,
     *  weight?: string
     * }} param0 
     * @todo Add font-style support
     */
    constructor ({ name = null, textStyle = null, size = null, weight = null  }) {
        this.name = typeof name === "string" || name instanceof String ? name.toString() : null
        this.textStyle = TextStyle.contains(textStyle) ? textStyle : TextStyle.default
        this.weight = Weight.contains(weight) ? weight : null

        if (size instanceof Length || typeof size === "number" || size instanceof Number) {
            this.size = !(size instanceof Length) ? new Length(size, Measure.points) : size
        } else {
            this.size = new Length(1, Measure.parentFontSize)
        }
    }

    /**
     * 
     * @param {{
     *  name?: string,
     *  textStyle?: string,
     *  size?: Length|number,
     *  weight?: string
     * }} param0 
     */
    with ({ name, textStyle, size, weight }) {
        var clone = Object.assign({}, this)
        
        if (name !== null && name !== undefined) {
            clone.name = name
        }

        if (textStyle !== null && textStyle !== undefined) {
            clone.textStyle = textStyle
        }

        if (size !== null && size !== undefined) {
            clone.size = size
        }

        if (weight !== null && weight !== undefined) {
            clone.weight = weight
        }

        return new Font(clone)
    }

    toString () {
        // font-style font-variant font-weight font-size/line-height font-family
       var result = ""

       if (Weight.contains(this.weight)) {
           result += weightToCssValue(this.weight) + " "
       } else {
           result += "inherit "
       }

       if (this.size instanceof Length) {
           result += this.size + " "
       } else {
           result += "inherit "
       }

       if (typeof this.name === "string") {
           result += this.name
       } else {
           result += "inherit"
       }

       return result
    }
}

/**
 * @description A function to convert the TextStyle item to the tag name
 * @param {Symbol} style 
 */
export function textStyleToTagName (style) {
    if (!(TextStyle.contains(style))) {
        return undefined
    }
    
    switch (style) {
        case TextStyle.default:
            return "p"
        case TextStyle.largeTitle:
            return "h1"
        case TextStyle.title:
            return "h2"
        case TextStyle.headline:
            return "hl"
        case TextStyle.subheadline:
            return "sub"
        default:
            return TextStyle.getIdentifier(style)
    }
}

/**
 * @description A function to convert the Weight iitem to the css font-weight value
 * @param {Symbol} weight 
 */
export function weightToCssValue (weight) {
    if (!(Weight.contains(weight))) {
        return undefined
    }

    switch (weight) {
        case Weight.ultraThin:
            return "100"
        case Weight.thin:
            return "200"
        case Weight.light:
            return "300"
        case Weight.regular:
            return "400"
        case Weight.medium:
            return "500"
        case Weight.semibold:
            return "600"
        case Weight.bold:
            return "700"
        case Weight.heavy:
            return "800"
        case Weight.black:
            return "900"
    }
}

/** @todo more templates */

var defaultFont = new Font({ name: "sans-serif", size: new Length(18, Measure.pixels), style: TextStyle.default, weight: Weight.regular })
var titleFont = defaultFont.with({ size: new Length(28, Measure.pixels), style: TextStyle.title, weight: Weight.medium })
var largeTitleFont = titleFont.with({ size: new Length(36, Measure.pixels), style: TextStyle.largeTitle, weight: Weight.bold })
var inheritFont = new Font({})

inheritFont.toString = () => {
    return "inherit"
}

export const fonts = { inherit: inheritFont, default: defaultFont, title: titleFont, largeTitle: largeTitleFont }
