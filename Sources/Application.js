//
// Application.js
// Created on 03/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "./Views/View"
import { Weight, FontStyle, weightToCssValue, fontStyleToCssValue } from "./Values/Font"

function setTitle(titleStr) {
    var title = document.querySelector("title") || document.createElement("title")
    title.innerText = titleStr
    
    if (!title.parentNode) {
        document.head.appendChild(title)
    }
}

export class Application {
    /**
     * A method to set the title of the web app
     * @param {String} title Title of the app
     */
    static setTitle(title) {
        if (!document.head) {
            window.addEventListener("load", () => {
                setTitle(title)
            })
        } else {
            setTitle(title)
        }
    }

    /**
     * A method to asynchronously load font
     * @param   {Object}    options
     * @param   {String}    options.name       Name of a font
     * @param   {String}    options.url        Path to the font file
     * @param   {Symbol}    [options.weight]   Weight of the font. Item of the Weight enum
     * @param   {Symbol}    [options.style]    Style of the font. Item of the FontStyle enum
     * @returns {Promise}
     * @todo    Test the function
     */
    static loadFont({ name, url, weight = null, style = null }) {
        var font = new FontFace()
        font.family = name
        
        if (Weight.contains(weight)) {
            font.weight = weightToCssValue(weight)
        }

        if (FontStyle.contains(style)) {
            font.style = fontStyleToCssValue(style)
        }

        return font.load()
    }

    /**
     * A method to set the main view of the app
     * @param {View} view View that represents the app
     */
    static setView(view) {
        if (!document.body) {
            window.addEventListener("load", () => {
                view.mountTo(document.body)
            })
        } else {
            view.mountTo(document.body)
        }
    }
}
