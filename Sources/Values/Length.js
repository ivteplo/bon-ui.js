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
 * @public @enum
 */
export const Measure = new Enum("pixels", "points", "percent", "fontSize", "parentFontSize")

/**
 * @public @class
 * @description A class to describe the size of something
 */
export class Length {

    /**
     * @param {number} value 
     * @param {Symbol} measure 
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
 * @public @function
 * @param {Symbol} measure 
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
        case Measure.percent:
            return "%"
        case Measure.fontSize:
            return "rem"
        case Measure.parentFontSize:
            return "em"
    }
}
