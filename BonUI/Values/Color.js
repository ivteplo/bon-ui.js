//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { State } from "../State.js"

/**
 * A class to represent the color
 * @class
 */
export class Color {
    /**
     * @param {Object} options
     * @param {Number} options.red
     * @param {Number} options.green
     * @param {Number} options.blue
     * @param {Number} options.alpha
     */
    constructor ({ red = 0, green = 0, blue = 0, alpha = 1 }) {
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

    /**
     * A method that returns the new Color with specified alpha value
     * @param {Number}  alpha The number between 0 and 1
     * @returns {Color} the clone of the current color with specified alpha value
     */
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

const darkTheme = {
    blue: new Color({ red: 10, green: 132, blue: 255 }),
    green: new Color({ red: 48, green: 209, blue: 88 }),
    indigo: new Color({ red: 94, green: 92, blue: 230 }),
    orange: new Color({ red: 255, green: 159, blue: 10 }),
    pink: new Color({ red: 255, green: 55, blue: 95 }),
    purple: new Color({ red: 191, green: 90, blue: 242 }),
    red: new Color({ red: 255, green: 69, blue: 58 }),
    teal: new Color({ red: 100, green: 210, blue: 255 }),
    yellow: new Color({ red: 255, green: 214, blue: 10 }),
    label: new Color({ red: 0xFF, green: 0xFF, blue: 0xFF }),
    secondaryLabel: new Color({ red: 0xEE, green: 0xEE, blue: 0xEE }),
    tertiaryLabel: new Color({ red: 0xBB, green: 0xBB, blue: 0xBB }),
    quaternaryLabel: new Color({ red: 0x88, green: 0x88, blue: 0x88 }),
    separator: new Color({ red: 0x33, green: 0x33, blue: 0x33 })
}

const lightTheme = {
    blue: new Color({ red: 0, green: 122, blue: 255 }),
    green: new Color({ red: 52, green: 199, blue: 89 }),
    indigo: new Color({ red: 88, green: 86, blue: 214 }),
    orange: new Color({ red: 255, green: 149, blue: 0 }),
    pink: new Color({ red: 255, green: 45, blue: 85 }),
    purple: new Color({ red: 175, green: 82, blue: 222 }),
    red: new Color({ red: 255, green: 59, blue: 48 }),
    teal: new Color({ red: 90, green: 200, blue: 250 }),
    yellow: new Color({ red: 255, green: 204, blue: 0 }),
    label: new Color({ red: 0, green: 0, blue: 0 }),
    secondaryLabel: new Color({ red: 0x33, green: 0x33, blue: 0x33 }),
    tertiaryLabel: new Color({ red: 0x55, green: 0x55, blue: 0x55 }),
    quaternaryLabel: new Color({ red: 0x88, green: 0x88, blue: 0x88 }),
    separator: new Color({ red: 0xE5, green: 0xE5, blue: 0xE5 })
}

/**
 * The list of handpicked colors
 */
export const Colors = {
    // blue colors
    aero: new Color({ red: 0x78, green: 0xC0, blue: 0xE0 }),
    ultramarineBlue: new Color({ red: 0x4D, green: 0x6C, blue: 0xFA }),
    persianBlue: new Color({ red: 0x19, green: 0x2B, blue: 0xC2 }),
    // it's overriden by CSS color
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
    // these two are also overriden by CSS colors
    mediumPurple: new Color({ red: 0x83, green: 0x72, blue: 0xDB }),
    slateBlue: new Color({ red: 0x72, green: 0x5A, blue: 0xC1 }),
    darkLavender: new Color({ red: 0x60, green: 0x4D, blue: 0x9E }),
    rebeccaPurple: new Color({ red: 0x66, green: 0x2E, blue: 0x96 }),
    deepViolet: new Color({ red: 0x36, green: 0x05, blue: 0x68 }),

    // CSS colors
    aliceBlue : new Color({ red: 240, green: 248, blue: 255}),
    antiqueWhite : new Color({ red: 250, green: 235, blue: 215}),
    aqua : new Color({ red: 0, green: 255, blue: 255}),
    aquamarine : new Color({ red: 127, green: 255, blue: 212}),
    azure : new Color({ red: 240, green: 255, blue: 255}),
    beige : new Color({ red: 245, green: 245, blue: 220}),
    bisque : new Color({ red: 255, green: 228, blue: 196}),
    black : new Color({ red: 0, green: 0, blue: 0}),
    blanchedAlmond : new Color({ red: 255, green: 235, blue: 205}),
    blue : new Color({ red: 0, green: 0, blue: 255}),
    blueViolet : new Color({ red: 138, green: 43, blue: 226}),
    brown : new Color({ red: 165, green: 42, blue: 42}),
    burlyWood : new Color({ red: 222, green: 184, blue: 135}),
    cadetBlue : new Color({ red: 95, green: 158, blue: 160}),
    chartreuse : new Color({ red: 127, green: 255, blue: 0}),
    chocolate : new Color({ red: 210, green: 105, blue: 30}),
    coral : new Color({ red: 255, green: 127, blue: 80}),
    cornflowerBlue : new Color({ red: 100, green: 149, blue: 237}),
    cornsilk : new Color({ red: 255, green: 248, blue: 220}),
    crimson : new Color({ red: 220, green: 20, blue: 60}),
    cyan : new Color({ red: 0, green: 255, blue: 255}),
    darkBlue : new Color({ red: 0, green: 0, blue: 139}),
    darkCyan : new Color({ red: 0, green: 139, blue: 139}),
    darkGoldenRod : new Color({ red: 184, green: 134, blue: 11}),
    darkGray : new Color({ red: 169, green: 169, blue: 169}),
    darkGrey : new Color({ red: 169, green: 169, blue: 169}),
    darkGreen : new Color({ red: 0, green: 100, blue: 0}),
    darkKhaki : new Color({ red: 189, green: 183, blue: 107}),
    darkMagenta : new Color({ red: 139, green: 0, blue: 139}),
    darkOliveGreen : new Color({ red: 85, green: 107, blue: 47}),
    darkorange : new Color({ red: 255, green: 140, blue: 0}),
    darkOrchid : new Color({ red: 153, green: 50, blue: 204}),
    darkRed : new Color({ red: 139, green: 0, blue: 0}),
    darkSalmon : new Color({ red: 233, green: 150, blue: 122}),
    darkSeaGreen : new Color({ red: 143, green: 188, blue: 143}),
    darkSlateBlue : new Color({ red: 72, green: 61, blue: 139}),
    darkSlateGray : new Color({ red: 47, green: 79, blue: 79}),
    darkSlateGrey : new Color({ red: 47, green: 79, blue: 79}),
    darkTurquoise : new Color({ red: 0, green: 206, blue: 209}),
    darkViolet : new Color({ red: 148, green: 0, blue: 211}),
    deepPink : new Color({ red: 255, green: 20, blue: 147}),
    deepSkyBlue : new Color({ red: 0, green: 191, blue: 255}),
    dimGray : new Color({ red: 105, green: 105, blue: 105}),
    dimGrey : new Color({ red: 105, green: 105, blue: 105}),
    dodgerBlue : new Color({ red: 30, green: 144, blue: 255}),
    fireBrick : new Color({ red: 178, green: 34, blue: 34}),
    floralWhite : new Color({ red: 255, green: 250, blue: 240}),
    forestGreen : new Color({ red: 34, green: 139, blue: 34}),
    fuchsia : new Color({ red: 255, green: 0, blue: 255}),
    gainsboro : new Color({ red: 220, green: 220, blue: 220}),
    ghostWhite : new Color({ red: 248, green: 248, blue: 255}),
    gold : new Color({ red: 255, green: 215, blue: 0}),
    goldenRod : new Color({ red: 218, green: 165, blue: 32}),
    gray : new Color({ red: 128, green: 128, blue: 128}),
    grey : new Color({ red: 128, green: 128, blue: 128}),
    green : new Color({ red: 0, green: 128, blue: 0}),
    greenYellow : new Color({ red: 173, green: 255, blue: 47}),
    honeyDew : new Color({ red: 240, green: 255, blue: 240}),
    hotPink : new Color({ red: 255, green: 105, blue: 180}),
    indianRed  : new Color({ red: 205, green: 92, blue: 92}),
    indigo  : new Color({ red: 75, green: 0, blue: 130}),
    ivory : new Color({ red: 255, green: 255, blue: 240}),
    khaki : new Color({ red: 240, green: 230, blue: 140}),
    lavender : new Color({ red: 230, green: 230, blue: 250}),
    lavenderBlush : new Color({ red: 255, green: 240, blue: 245}),
    lawnGreen : new Color({ red: 124, green: 252, blue: 0}),
    lemonChiffon : new Color({ red: 255, green: 250, blue: 205}),
    lightBlue : new Color({ red: 173, green: 216, blue: 230}),
    lightCoral : new Color({ red: 240, green: 128, blue: 128}),
    lightCyan : new Color({ red: 224, green: 255, blue: 255}),
    lightGoldenRodYellow : new Color({ red: 250, green: 250, blue: 210}),
    lightGray : new Color({ red: 211, green: 211, blue: 211}),
    lightGrey : new Color({ red: 211, green: 211, blue: 211}),
    lightGreen : new Color({ red: 144, green: 238, blue: 144}),
    lightPink : new Color({ red: 255, green: 182, blue: 193}),
    lightSalmon : new Color({ red: 255, green: 160, blue: 122}),
    lightSeaGreen : new Color({ red: 32, green: 178, blue: 170}),
    lightSkyBlue : new Color({ red: 135, green: 206, blue: 250}),
    lightSlateGray : new Color({ red: 119, green: 136, blue: 153}),
    lightSlateGrey : new Color({ red: 119, green: 136, blue: 153}),
    lightSteelBlue : new Color({ red: 176, green: 196, blue: 222}),
    lightYellow : new Color({ red: 255, green: 255, blue: 224}),
    lime : new Color({ red: 0, green: 255, blue: 0}),
    limeGreen : new Color({ red: 50, green: 205, blue: 50}),
    linen : new Color({ red: 250, green: 240, blue: 230}),
    magenta : new Color({ red: 255, green: 0, blue: 255}),
    maroon : new Color({ red: 128, green: 0, blue: 0}),
    mediumAquaMarine : new Color({ red: 102, green: 205, blue: 170}),
    mediumBlue : new Color({ red: 0, green: 0, blue: 205}),
    mediumOrchid : new Color({ red: 186, green: 85, blue: 211}),
    mediumPurple : new Color({ red: 147, green: 112, blue: 216}),
    mediumSeaGreen : new Color({ red: 60, green: 179, blue: 113}),
    mediumSlateBlue : new Color({ red: 123, green: 104, blue: 238}),
    mediumSpringGreen : new Color({ red: 0, green: 250, blue: 154}),
    mediumTurquoise : new Color({ red: 72, green: 209, blue: 204}),
    mediumVioletRed : new Color({ red: 199, green: 21, blue: 133}),
    midnightBlue : new Color({ red: 25, green: 25, blue: 112}),
    mintCream : new Color({ red: 245, green: 255, blue: 250}),
    mistyRose : new Color({ red: 255, green: 228, blue: 225}),
    moccasin : new Color({ red: 255, green: 228, blue: 181}),
    navajoWhite : new Color({ red: 255, green: 222, blue: 173}),
    navy : new Color({ red: 0, green: 0, blue: 128}),
    oldLace : new Color({ red: 253, green: 245, blue: 230}),
    olive : new Color({ red: 128, green: 128, blue: 0}),
    oliveDrab : new Color({ red: 107, green: 142, blue: 35}),
    orange : new Color({ red: 255, green: 165, blue: 0}),
    orangeRed : new Color({ red: 255, green: 69, blue: 0}),
    orchid : new Color({ red: 218, green: 112, blue: 214}),
    paleGoldenRod : new Color({ red: 238, green: 232, blue: 170}),
    paleGreen : new Color({ red: 152, green: 251, blue: 152}),
    paleTurquoise : new Color({ red: 175, green: 238, blue: 238}),
    paleVioletRed : new Color({ red: 216, green: 112, blue: 147}),
    papayaWhip : new Color({ red: 255, green: 239, blue: 213}),
    peachPuff : new Color({ red: 255, green: 218, blue: 185}),
    peru : new Color({ red: 205, green: 133, blue: 63}),
    pink : new Color({ red: 255, green: 192, blue: 203}),
    plum : new Color({ red: 221, green: 160, blue: 221}),
    powderBlue : new Color({ red: 176, green: 224, blue: 230}),
    purple : new Color({ red: 128, green: 0, blue: 128}),
    red : new Color({ red: 255, green: 0, blue: 0}),
    rosyBrown : new Color({ red: 188, green: 143, blue: 143}),
    royalBlue : new Color({ red: 65, green: 105, blue: 225}),
    saddleBrown : new Color({ red: 139, green: 69, blue: 19}),
    salmon : new Color({ red: 250, green: 128, blue: 114}),
    sandyBrown : new Color({ red: 244, green: 164, blue: 96}),
    seaGreen : new Color({ red: 46, green: 139, blue: 87}),
    seaShell : new Color({ red: 255, green: 245, blue: 238}),
    sienna : new Color({ red: 160, green: 82, blue: 45}),
    silver : new Color({ red: 192, green: 192, blue: 192}),
    skyBlue : new Color({ red: 135, green: 206, blue: 235}),
    slateBlue : new Color({ red: 106, green: 90, blue: 205}),
    slateGray : new Color({ red: 112, green: 128, blue: 144}),
    slateGrey : new Color({ red: 112, green: 128, blue: 144}),
    snow : new Color({ red: 255, green: 250, blue: 250}),
    springGreen : new Color({ red: 0, green: 255, blue: 127}),
    steelBlue : new Color({ red: 70, green: 130, blue: 180}),
    tan : new Color({ red: 210, green: 180, blue: 140}),
    teal : new Color({ red: 0, green: 128, blue: 128}),
    thistle : new Color({ red: 216, green: 191, blue: 216}),
    tomato : new Color({ red: 255, green: 99, blue: 71}),
    turquoise : new Color({ red: 64, green: 224, blue: 208}),
    violet : new Color({ red: 238, green: 130, blue: 238}),
    wheat : new Color({ red: 245, green: 222, blue: 179}),
    white : new Color({ red: 255, green: 255, blue: 255}),
    whiteSmoke : new Color({ red: 245, green: 245, blue: 245}),
    yellow : new Color({ red: 255, green: 255, blue: 0}),
    yellowGreen : new Color({ red: 154, green: 205, blue: 50}),
    theme: lightTheme
}

export function createThemeState () {
    if (typeof window === "object" && "matchMedia" in window) {
        const query = "(prefers-color-scheme: dark)"
        const media = window.matchMedia(query)
        const defaultState = {
            mode: media.matches ? "dark" : "light"
        }

        const theme = new State((state = defaultState, action) => {
            switch (action.type) {
                case "color-scheme-update":
                    return Object.assign(state, { mode: action.value })
                default:
                    return state
            }
        })

        media.addListener(event => {
            theme.dispatch({
                type: "color-scheme-update",
                value: event.matches ? "dark" : "light"
            })
        })

        function handler () {
            if (theme.current.mode === "dark") {
                Colors.theme = darkTheme
            } else {
                Colors.theme = lightTheme
            }
        }

        handler()
        theme.subscribe(handler)
        return theme
    }
}

