//
// ApplicationDelegate.js
// Created on 03/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "./Views/View"
import { VNodeType, VNode } from "./VirtualDOM/VNode"
import { Weight, FontStyle, weightToCssValue, fontStyleToCssValue } from "./Values/Font"

/**
 * Class that contains methods to manage the app
 */
export class ApplicationManager {
    constructor() {
        this.title = ""
        this.view = null
        this.fonts = []
    }

    /**
     * A method to set the title of the web app
     * @param {String} title Title of the app
     */
    setTitle(title) {
        this.title = String(title)
    }

    /**
     * A method to add font to fonts list
     * @param   {Object}    options
     * @param   {String}    options.name       Name of a font
     * @param   {String}    options.url        Path to the font file
     * @param   {Symbol}    [options.weight]   Weight of the font. Item of the Weight enum
     * @param   {Symbol}    [options.style]    Style of the font. Item of the FontStyle enum
     * @returns {Promise}
     */
    addFont({ name, url, weight = null, style = null }) {
        var descriptors = {}

        if (Weight.contains(weight)) {
            descriptors.weight = weightToCssValue(weight)
        }

        if (FontStyle.contains(style)) {
            descriptors.style = fontStyleToCssValue(style)
        }

        descriptors.name = name

        var font = new FontFace(name, `url(${url})`, descriptors)
        this.fonts.push(font)
    }

    /**
     * A method to load added fonts asynchronously
     */
    loadFonts() {
        return Promise.all(this.fonts.map(font => {
            return font.load().then(loadedFont => {
                document.fonts.add(loadedFont)
            })
        }))
    }

    /**
     * A method to set the main view of the app
     * @param {View} view View that represents the app
     */
    setView(view) {
        this.view = view
    }

    /**
     * A method to load the application view
     */
    loadView() {
        if (!document.body) {
            window.addEventListener("load", () => {
                this.loadView()
            })
            return
        }

        this.view.mountTo(document.body)
    }

    /**
     * A method to load the app
     */
    loadApp() {
        return (
            this.loadFonts()
                .then(() => {
                    document.head.title = this.title
                    this.loadView()
                })
                .catch(error => {
                    console.error("Error loading application: ", error)
                })
        )
    }

    /**
     * A function that makes the page look better
     * @param {Object}  options
     * @param {Boolean} options.applyFlexToBody Applies the `display: flex` to the body if `true`
     */
    static normalizeDocumentStyles({ applyFlexToBody = true }) {
        if (!document.body) {
            window.addEventListener("load", () => __normalizeDocumentStyles({ applyFlexToBody }))
        } else {
            __normalizeDocumentStyles({ applyFlexToBody })
        }
    }
}

function __normalizeDocumentStyles({ applyFlexToBody }) {
    document.querySelectorAll("html, body").forEach(item => {
        item.style.margin = "0"
        item.style.padding = "0"
    })
    
    document.body.style.minHeight = "100vh"
    document.body.style.font = "normal 14pt sans-serif"

    if (applyFlexToBody) {
        document.body.style.display = "flex"
        document.body.style.alignItems = "center"
        document.body.style.justifyContent = "center"
    }
}
