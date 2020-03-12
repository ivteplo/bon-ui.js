//
// Color.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

/**
 * @public @class
 * @description A class to represent the color
 */
export class Color {
    /**
     * @param {{
     *  red: number,
     *  green: number,
     *  blue: number,
     *  alpha: number
     * }} param0 
     */
    constructor ({ red, green, blue, alpha = 1 }) {
        [red, green, blue, alpha].forEach(item => {
            if (!(item !== undefined && item !== null && (item instanceof Number || typeof item == "number") && item >= 0 && item <= 255)) {
                throw new Error("Invalid argument passed to the Color constructor (" + (item !== undefined && items !== null ? item.toString() : item) + ")")
            }
        })

        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = (alpha > 1 ? 1 : (alpha < 0 ? 0 : alpha))
    }

    withAlpha (alpha) {
        var clone = Object.assign({}, this)
        if ((typeof alpha === "number" || alpha instanceof Number) && Number(alpha) >= 0 && Number(alpha) <= 1) {
            clone.alpha = alpha
        }

        return new Color(clone)
    }

    toString () {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }
}

export const Colors = {
    // white and grey and blue colors
    white: new Color({ red: 0xFF, green: 0xFF, blue: 0xFF }),
    lightGray: new Color({ red: 0xAA, green: 0xAA, blue: 0xAA }),
    gray: new Color({ red: 0x88, green: 0x88, blue: 0x88}),
    darkGray: new Color({ red: 0x22, green: 0x22, blue: 0x22 }),
    black: new Color({ red: 0x0, green: 0x0, blue: 0x0 }),

    // blue colors
    aero: new Color({ red: 0x78, green: 0xC0, blue: 0xE0 }),
    ultramarineBlue: new Color({ red: 0x4D, green: 0x6C, blue: 0xFA }),
    persianBlue: new Color({ red: 0x19, green: 0x2B, blue: 0xC2 }),
    midnightBlue: new Color({ red: 0x15, green: 0x05, blue: 0x78 }),
    spaceCadet: new Color({ red: 0x0E, green: 0x0E, blue: 0x52 }),

    // yellow and orange and brown colors
    mellowYellow: new Color({ red: 0xF3, green: 0xE3, blue: 0x7C }),
    deepSaffron: new Color({ red: 0xF1, green: 0x9A, blue: 0x3E }),
    vividOrangePeel: new Color({ red: 0xF0, green: 0xA2, blue: 0x02 }),
    princetonOrange: new Color({ red: 0xFE, green: 0x7F, blue: 0x2D }),
    ruddyBrown: new Color({ red: 0xBA, green: 0x56, blue: 0x24 }),

    // green colors
    mediumSeaGreen: new Color({ red: 0x38, green: 0xAF, blue: 0x68 }),
    kellyGreen: new Color({ red: 0x4C, green: 0xC1, blue: 0x3F }),
    northTexasGreen: new Color({ red: 0x11, green: 0x89, blue: 0x2F }),
    bottleGreen: new Color({ red: 0x04, green: 0x72, blue: 0x4D }),
    darkSlateGray: new Color({ red: 0x27, green: 0x56, blue: 0x4D }),
    
    // red and brown and pink colors
    paradisePink: new Color({ red: 0xEB, green: 0x51, blue: 0x60 }),
    pantoneRed: new Color({ red: 0xF2, green: 0x29, blue: 0x3D }),
    rossoCorsa: new Color({ red: 0xDB, green: 0x02, blue: 0x05 }),
    rosewood: new Color({ red: 0x59, green: 0x00, blue: 0x04 }),
    blackBean: new Color({ red: 0x30, green: 0x0E, blue: 0x01 }),

    // violet and purple and blue colors
    mediumPurple: new Color({ red: 0x83, green: 0x72, blue: 0xDB }),
    slateBlue: new Color({ red: 0x72, green: 0x5A, blue: 0xC1 }),
    darkLavender: new Color({ red: 0x60, green: 0x4D, blue: 0x9E }),
    rebeccaPurple: new Color({ red: 0x66, green: 0x2E, blue: 0x96 }),
    deepViolet: new Color({ red: 0x36, green: 0x05, blue: 0x68 }),
}
