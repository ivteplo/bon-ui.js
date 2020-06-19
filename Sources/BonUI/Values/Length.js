//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"
import { InvalidValueException } from "./Exceptions.js"

/**
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

export class Length {
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

export function pixels (value) {
    return new Length(value, Measure.pixels)
}

export function points (value) {
    return new Length(value, Measure.points)
}

export function percents (value) {
    return new Length(value, Measure.percents)
}

export function viewportWidth (value) {
    return new Length(value, Measure.viewportWidth)
}

export function viewportHeight (value) {
    return new Length(value, Measure.viewportHeight)
}

export function fontSize (value) {
    return new Length(value, Measure.fontSize)
}

export function parentFontSize (value) {
    return new Length(value, Measure.parentFontSize)
}
