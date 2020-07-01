//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "./Exceptions.js"
import { State } from "./State.js"

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

    static transparent = this.gray.withAlpha(0)
    
    // British accent color names
    static grey = this.gray
    static lightGrey = this.lightGray
    static darkGrey = this.darkGray

    static indigo = new Color({ red: 88, green: 86, blue: 214 })
    static purple = new Color({ red: 175, green: 82, blue: 222 })
    static blue = new Color({ red: 0, green: 122, blue: 255 })
    static teal = new Color({ red: 90, green: 200, blue: 250 })

    static brown = new Color({ red: 0x90, green: 0x0A, blue: 0x0A })
    static red = new Color({ red: 255, green: 59, blue: 48 })
    static pink = new Color({ red: 0xD4, green: 0x2F, blue: 0x89 })
    
    static orange = new Color({ red: 255, green: 149, blue: 0 })
    static yellow = new Color({ red: 255, green: 204, blue: 0 })
    static green = new Color({ red: 52, green: 199, blue: 89 })
    
    static background = Color.white
    static largeTitle = Color.black
    static title = Color.black
    static subheading = Color.darkGray
    static sectionTitle = Color.darkGray
    static caption = this.sectionTitle
    static text = Color.gray
    static divider = new Color({ red: 0xBB, green: 0xBB, blue: 0xBB })
}

const darkThemeColors = {
    indigo: new Color({ red: 94, green: 92, blue: 230 }),
    purple: new Color({ red: 191, green: 90, blue: 242 }),
    blue: new Color({ red: 10, green: 132, blue: 255 }),
    teal: new Color({ red: 100, green: 210, blue: 255 }),
    
    brown: new Color({ red: 0xAC, green: 0x3C, blue: 0x3C }),
    red: new Color({ red: 255, green: 69, blue: 58 }),
    pink: new Color({ red: 0xE8, green: 0x48, blue: 0xA0 }),

    orange: new Color({ red: 255, green: 159, blue: 10 }),
    yellow: new Color({ red: 255, green: 214, blue: 10 }),
    green: new Color({ red: 48, green: 209, blue: 88 }),
    
    background: Color.black,
    largeTitle: Color.white,
    title: Color.white,
    subheading: Color.lightGray,
    sectionTitle: Color.lightGray,
    caption: Color.lightGray,
    text: Color.gray,
    divider: new Color({ red: 0x5E, green: 0x5E, blue: 0x5E })
}

export function createColorSchemeState () {
    var defaultState = {
        mode: "light"
    }

    const hasMatchMedia = typeof window === "object" && "matchMedia" in window

    if (hasMatchMedia) {
        const query = "(prefers-color-scheme: dark)"
        var media = window.matchMedia(query)
        defaultState.mode = media.matches ? "dark" : "light"
    }

    const lightThemeColors = {}

    for (let i in darkThemeColors) {
        lightThemeColors[i] = Color[i]
    }

    const theme = new State((state = defaultState, action) => {
        switch (action.type) {
            case "color-scheme-update":
                return Object.assign(state, { mode: action.value })
            default:
                return state
        }
    })

    if (hasMatchMedia) {
        media.addListener(event => {
            theme.dispatch({
                type: "color-scheme-update",
                value: event.matches ? "dark" : "light"
            })
        })
    }

    function handler () {
        var themeColors
        if (theme.current.mode === "dark") {
            themeColors = darkThemeColors
        } else {
            themeColors = lightThemeColors
        }

        for (let i in themeColors) {
            Color[i] = themeColors[i]
        }
    }

    theme.subscribe(handler)
    return theme
}
