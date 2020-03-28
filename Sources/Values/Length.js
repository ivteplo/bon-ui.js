//
// Length.js
// Created on 08/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { Enum } from "./Enum"

/**
 * An enum that is used to specify the measure of the length
 * @enum
 * @property {Symbol} pixels            Pixels
 * @property {Symbol} points            Screen points
 * @property {Symbol} percents          Percents of a parent size
 * @property {Symbol} fontSize          Size relative to the document default font size
 * @property {Symbol} parentFontSize    Size relative to the parent font size
 * @property {Symbol} viewportHeight    Percents of a browser height
 * @property {Symbol} viewportWidth     Percents of a browser width
 */
export const Measure = new Enum("pixels", "points", "percents", "fontSize", "parentFontSize", "viewportHeight", "viewportWidth")

/**
 * A class to describe the size of something
 * @class
 */
export class Length {
    /**
     * @param {Number} value    The value of the length
     * @param {Symbol} measure  The item of the Measure enum
     */
    constructor (value, measure) {
        if (!(typeof value === "number" || value instanceof Number) || !Measure.contains(measure)) {
            throw new Error("Invalid argument passed into the constructor")
        }

        this.value = Number(value)
        this.measure = measure
    }

    toString () {
        return `${this.value}` + measureToCssUnit(this.measure)
    }
}

/**
 * A function that is used to convert the Measure enum item to the CSS unit
 * @param   {Symbol} measure 
 * @returns {String} CSS unit
 */
export function measureToCssUnit (measure) {
    if (!Measure.contains(measure)) {
        return undefined
    }

    switch (measure) {
        case Measure.pixels:
            return "px"
        case Measure.points:
            return "pt"
        case Measure.percents:
            return "%"
        case Measure.fontSize:
            return "rem"
        case Measure.parentFontSize:
            return "em"
        case Measure.viewportHeight:
            return "vh"
        case Measure.viewportWidth:
            return "vw"
    }
}

/**
 * A shorthand for length in pixels
 * @param {number} value 
 */
export function pixels(value) {
    return new Length(value, Measure.pixels)
}

/**
 * A shorthand for length in points 
 * @param {number} value 
 */
export function points(value) {
    return new Length(value, Measure.points)
}

/**
 * A shorthand for length in percents
 * @param {number} value 
 */
export function percents(value) {
    return new Length(value, Measure.percents)
}

/**
 * A shorthand for length in font sizes (rem in CSS)
 * @param {number} value 
 */
export function fontSize(value) {
    return new Length(value, Measure.fontSize)
}

/**
 * A shorthand for length in parent font sizes (em in CSS)
 * @param {number} value 
 */
export function parentFontSize(value) {
    return new Length(value, Measure.parentFontSize)
}

/**
 * A shorthand for length in viewport widths
 * @param {number} value 
 */
export function viewportWidth(value) {
    return new Length(value, Measure.viewportWidth)
}

/**
 * A shorthand for length in viewport heights
 * @param {number} value 
 */
export function viewportHeight(value) {
    return new Length(value, Measure.viewportHeight)
}
