//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Length, pixels, parentFontSize } from "./Length.js"
import { InvalidValueException } from "./Exceptions.js"
import { Enum } from "./Enums/Enum.js"

/**
 * @enum     {Symbol}
 * @property {Symbol} default       default text style
 * @property {Symbol} largeTitle    main heading of the page style
 * @property {Symbol} title         secondary-level heading of the page
 * @property {Symbol} subheading    third-level heading of the page
 * @property {Symbol} sectionTitle  fourth-level heading of the page
 * @property {Symbol} caption       text style for captions
 * @property {Symbol} monospace     text style for code
 * @category Enums
 * @subcategory Font description
 */
export const TextStyle = new Enum("default", "largeTitle", "title", "subheading", "sectionTitle", "caption", "monospace")

/**
 * @enum     {Symbol}
 * @property {Symbol} regular       default text weight
 * @property {Symbol} ultraLight    very light text weight
 * @property {Symbol} extraLight    very light text weight. The same as ultraLight
 * @property {Symbol} light         light text weight
 * @property {Symbol} thin          thin text weight
 * @property {Symbol} medium        medium text weight
 * @property {Symbol} semibold      semibold text weight
 * @property {Symbol} bold          bold text weight
 * @property {Symbol} heavy         heavy text weight
 * @property {Symbol} black         black text weight
 * @category Enums
 * @subcategory Font description
 */
export const Weight = new Enum("regular", "ultraLight", "extraLight", "thin", "light", "medium", "semibold", "bold", "heavy", "black")

/**
 * @enum     {Symbol}
 * @property {Symbol} normal        default font style
 * @property {Symbol} italic        italic font style
 * @property {Symbol} oblique       oblique font style
 * @category Enums
 * @subcategory Font description
 */
export const FontStyle = new Enum("normal", "italic", "oblique")

/**
 * Class that describes font
 * @category Values
 */
export class Font {
    /**
     * @param {Object}          options
     * @param {String}          [options.name]          Name of a font
     * @param {Symbol}          [options.textStyle]     Style of a text
     * @param {Length|number}   [options.size]          Size of a font
     * @param {Symbol}          [options.weight]        Weight of a font
     * @param {Symbol}          [options.fontStyle]     Style of a font
     */
    constructor ({ name = null, textStyle = null, size = null, weight = null, fontStyle = null  } = {}) {
        if (!name && !textStyle && !size && !weight && !fontStyle) {
            throw new InvalidValueException(`Information about font is not specified`)
        }

        this.name = name
        this.textStyle = TextStyle.contains(textStyle) ? textStyle : TextStyle.default
        this.weight = Weight.contains(weight) ? weight : null
        this.fontStyle = FontStyle.contains(fontStyle) ? fontStyle : null

        if (size instanceof Length || typeof size === "number") {
            this.size = !(size instanceof Length) ? pixels(size) : size
        } else {
            this.size = parentFontSize(1)
        }
    }

    /**
     * Method to create a copy of a font and change some of properties
     * @param {Object}          options
     * @param {String}          [options.name]          Name of a font
     * @param {Symbol}          [options.textStyle]     Style of a text
     * @param {Length|number}   [options.size]          Size of a font
     * @param {Symbol}          [options.weight]        Weight of a font
     * @param {Symbol}          [options.fontStyle]     Style of a font
     */
    with ({ name, textStyle, size, weight, fontStyle } = {}) {
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
            switch (this.fontStyle) {
                case FontStyle.normal:
                    result += "normal"
                case FontStyle.italic:
                    result += "italic"
                case FontStyle.oblique:
                    result += "oblique"
            }

            result += " "
        }

        if (Weight.contains(this.weight)) {
            switch (this.weight) {
                case Weight.ultraThin:
                    result += "100"
                case Weight.thin:
                case Weight.ultraLight:
                case Weight.extraLight:
                    result += "200"
                case Weight.light:
                    result += "300"
                case Weight.regular:
                    result += "400"
                case Weight.medium:
                    result += "500"
                case Weight.semibold:
                    result += "600"
                case Weight.bold:
                    result += "700"
                case Weight.heavy:
                    result += "800"
                case Weight.black:
                    result += "900"
            }
            
            result += " "
        }

        if (this.size instanceof Length || typeof this.size === "number") {
            result += (this.size instanceof Length ? this.size : pixels(this.size)) + " "
        } else {
            result += "1em "
        }

        if (typeof this.name === "string") {
            result += this.name
        } else {
            result += "inherit"
        }

        return result.trim()
    }

    static text = new Font({ 
        name: "sans-serif", 
        size: pixels(18), 
        textStyle: TextStyle.default, 
        weight: Weight.regular
    })
    
    static title = this.text.with({ 
        size: pixels(30), 
        textStyle: TextStyle.title, 
        weight: Weight.medium 
    })
    
    static largeTitle = this.title.with({ 
        size: pixels(36), 
        textStyle: TextStyle.largeTitle, 
        weight: Weight.bold 
    })
    
    static subheading = this.title.with({
        size: pixels(22),
        textStyle: TextStyle.subheading
    })

    static sectionTitle = this.subheading.with({
        size: pixels(14),
        textStyle: TextStyle.sectionTitle
    })
    
    static monospace = this.text.with({
        name: "monospace",
        textStyle: TextStyle.monospace,
        size: pixels(16)
    })

    static caption = this.text.with({
        textStyle: TextStyle.caption,
        size: pixels(14),
        weight: Weight.light
    })
}
