//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "./Exceptions.js"
import { Enum } from "./Enum.js"

/**
 * @enum     {Sumbol}
 * @property {Symbol} pixels
 * @property {Symbol} points
 * @property {Symbol} fontSize
 * @property {Symbol} parentFontSize
 * @property {Symbol} percents
 * @property {Symbol} viewportWidth
 * @property {Symbol} viewportHeight
 */
export const Measure = new Enum("pixels", "points", "fontSize", "parentFontSize", "percents", "viewportWidth", "viewportHeight")

function measureToString (measure) {
    switch (measure) {
        case Measure.pixels:
            return "px"
        case Measure.points:
            return "pt"
        case Measure.fontSize:
            return "rem"
        case Measure.parentFontSize:
            return "em"
        case Measure.percents:
            return "%"
        case Measure.viewportWidth:
            return "vw"
        case Measure.viewportHeight:
            return "vh"
        default:
            return undefined
    }
}

/**
 * Class to represent the length
 */
export class Length {
    /**
     * @param {number} value length
     * @param {Symbol} units item of Measure enum
     */
    constructor (value, units) {
        if (typeof value !== "number") {
            throw new InvalidValueException(`Expected number as a value, got ${typeof value}`)
        }

        if (!Measure.contains(units)) {
            throw new InvalidValueException(`Expected Measure enum item as units, got unexpected ${typeof units}`)
        }

        this.value = value
        this.units = units
    }

    toString () {
        return String(this.value) + measureToString(this.units)
    }
}

/**
 * Method to create new Length instance that uses pixels for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function pixels (value) {
    return new Length(value, Measure.pixels)
}

/**
 * Method to create new Length instance that uses points (pt) for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function points (value) {
    return new Length(value, Measure.points)
}

/**
 * Method to create new Length instance that uses percents for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function percents (value) {
    return new Length(value, Measure.percents)
}

/**
 * Method to create new Length instance that uses viewport width (vw) for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function viewportWidth (value) {
    return new Length(value, Measure.viewportWidth)
}

/**
 * Method to create new Length instance that uses viewport height (vh) for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function viewportHeight (value) {
    return new Length(value, Measure.viewportHeight)
}

/**
 * Method to create new Length instance that uses font size (rem) for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function fontSize (value) {
    return new Length(value, Measure.fontSize)
}

/**
 * Method to create new Length instance that uses parent font size (em) for measuring 
 * @param {number} value 
 * @returns {Length}
 */
export function parentFontSize (value) {
    return new Length(value, Measure.parentFontSize)
}
