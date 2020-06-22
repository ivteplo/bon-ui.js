//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "./Exceptions.js"

export class Color {
    constructor ({ red = 0, green = 0, blue = 0, alpha = 1 } = {}) {
        [ red, green, blue ].forEach(item => {
            if (typeof item !== "number") {
                throw new InvalidValueException(`Expected red/green/blue value number, got ${typeof item}`)
            }

            if (item < 0 || item > 255) {
                throw new InvalidValueException(`Expected red/green/blue value number from 0 to 255, got ${item}`)
            }
        })

        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
    }

    /**
     * Method to get the Color instance clone with specified alpha value
     * @param {number} alpha alpha value (number from 0 to 1)
     * @returns {Color}
     */
    withAlpha (alpha) {
        if (typeof alpha !== "number") {
            throw new InvalidValueException(`Expected alpha value number, got ${typeof item}`)
        }

        if (alpha < 0 || alpha > 1) {
            throw new InvalidValueException(`Expected alpha value number from 0 to 1, got ${item}`)
        }

        return new Color({
            ...this,
            alpha
        })
    }

    toString () {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }

    static white = new Color({ red: 255, green: 255, blue: 255 })
    static black = new Color()
    static gray = new Color({ red: 0x88, green: 0x88, blue: 0x88 })
    static lightGray = new Color({ red: 0xCC, green: 0xCC, blue: 0xCC })
    static darkGray = new Color({ red: 0x44, green: 0x44, blue: 0x44 })
    
    // British accent color names
    static grey = this.gray
    static lightGrey = this.lightGray
    static darkGrey = this.darkGray
}
