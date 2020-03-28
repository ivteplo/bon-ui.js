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
import { Length, pixels, parentFontSize } from "./Length"

/**
 * @enum
 * @property {Symbol} default       Default text style
 * @property {Symbol} largeTitle    Main heading of the page style
 * @property {Symbol} title         Secondary-level heading of the page
 * @property {Symbol} subheading    Third-level heading of the page
 * @property {Symbol} monospace     Text style for code
 */
export const TextStyle = new Enum("default", "largeTitle", "title", "subheading", "monospace")

/**
 * @enum
 * @property {Symbol} regular       Default text weight
 * @property {Symbol} ultraLight    Very light text weight
 * @property {Symbol} light         Light text weight
 * @property {Symbol} thin          Thin text weight
 * @property {Symbol} medium        Medium text weight
 * @property {Symbol} semibold      Semibold text weight
 * @property {Symbol} bold          Bold text weight
 * @property {Symbol} heavy         Heavy text weight
 * @property {Symbol} black         Black text weight
 */
export const Weight = new Enum("regular", "ultraLight", "thin", "light", "medium", "semibold", "bold", "heavy", "black")

/**
 * @enum
 * @property {Symbol} normal        Default font style
 * @property {Symbol} italic        Italic font style
 * @property {Symbol} oblique       Oblique font style
 */
export const FontStyle = new Enum("normal", "italic", "oblique")

/**
 * A class to describe which font to use for the component
 * @class
 */
export class Font {
    /**
     * @param {Object}          options
     * @param {String}          [options.name]          Name of a font
     * @param {Symbol}          [options.textStyle]     Style of a text
     * @param {Length|number}   [options.size]          Size of a font
     * @param {Symbol}          [options.weight]        Weight of a font
     * @param {Symbol}          [options.fontStyle]     Style of a font
     * @todo  Add font-style support
     */
    constructor ({ name = null, textStyle = null, size = null, weight = null, fontStyle = null  }) {
        this.name = typeof name === "string" || name instanceof String ? name.toString() : null
        this.textStyle = TextStyle.contains(textStyle) ? textStyle : TextStyle.default
        this.weight = Weight.contains(weight) ? weight : null
        this.fontStyle = FontStyle.contains(fontStyle) ? fontStyle : null

        if (size instanceof Length || typeof size === "number" || size instanceof Number) {
            this.size = !(size instanceof Length) ? pixels(size) : size
        } else {
            this.size = parentFontSize(1)
        }
    }

    /**
     * A method to create a copy of a font and change some of properties
     * @param {Object}          options
     * @param {String}          [options.name]          Name of a font
     * @param {Symbol}          [options.textStyle]     Style of a text
     * @param {Length|number}   [options.size]          Size of a font
     * @param {Symbol}          [options.weight]        Weight of a font
     * @param {Symbol}          [options.fontStyle]     Style of a font
     */
    with ({ name, textStyle, size, weight, fontStyle }) {
        var clone = Object.assign({}, this)
        
        if (typeof name === "string" || name instanceof String) {
            clone.name = name.toString()
        }

        if (TextStyle.contains(textStyle)) {
            clone.textStyle = textStyle
        }

        if (size instanceof Length || typeof size === "number" || size instanceof Number) {
            clone.size = !(size instanceof Length) ? pixels(size) : size
        }

        if (Weight.contains(weight)) {
            clone.weight = weight
        }

        if (FontStyle.contains(fontStyle)) {
            clone.fontStyle = fontStyle
        }

        return new Font(clone)
    }

    toString () {
        // font-style font-variant font-weight font-size/line-height font-family
       var result = ""

       if (FontStyle.contains(this.fontStyle)) {
           result += fontStyleToCssValue(this.fontStyle) + " "
       }

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
 * A function to convert the TextStyle item to the tag name
 * @param   {Symbol} style 
 * @returns {String} HTML tag name
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
        case TextStyle.subheading:
            return "h3"
        case TextStyle.monospace:
            return "code"
        default:
            return TextStyle.getIdentifier(style)
    }
}

/**
 * A function to convert the Weight item to the css font-weight value
 * @param   {Symbol} weight 
 * @returns {String} CSS `font-weight` value
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

/**
 * A function to convert the FontStyle item to the css font-style value
 * @param   {Symbol} fontStyle 
 * @returns {String} CSS `font-style` value
 */
export function fontStyleToCssValue(fontStyle) {
    if (!(FontStyle.contains(fontStyle))) {
        return undefined
    }

    switch (fontStyle) {
        case FontStyle.normal:
            return "normal"
        case FontStyle.italic:
            return "italic"
        case FontStyle.oblique:
            return "oblique"
    }
}

var defaultFont = new Font({ 
    name: "sans-serif", 
    size: pixels(18), 
    textStyle: TextStyle.default, 
    weight: Weight.regular 
})

var titleFont = defaultFont.with({ 
    size: pixels(30), 
    textStyle: TextStyle.title, 
    weight: Weight.medium 
})

var largeTitleFont = titleFont.with({ 
    size: pixels(36), 
    textStyle: TextStyle.largeTitle, 
    weight: Weight.bold 
})

var subheadingFont = titleFont.with({
    size: pixels(22),
    textStyle: TextStyle.subheading
})

var monospaceFont = defaultFont.with({
    name: "monospace",
    textStyle: TextStyle.monospace,
    size: pixels(16)
})

var inheritFont = new Font({})
inheritFont.toString = () => {
    return "inherit"
}

export const Fonts = { inherit: inheritFont, default: defaultFont, title: titleFont, largeTitle: largeTitleFont, subheading: subheadingFont, monospace: monospaceFont }
