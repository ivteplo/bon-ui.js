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
import { VNodeType, VNode, renderToVNode } from "./VirtualDOM/VNode"
import { Weight, FontStyle, weightToCssValue, fontStyleToCssValue } from "./Values/Font"

function setTitle(titleStr) {
    var title = document.querySelector("title") || document.createElement("title")
    title.innerText = titleStr
    
    if (!title.parentNode) {
        document.head.appendChild(title)
    }
}

/**
 * A list of DOM node types
 * @enum
 * @property {Symbol} tag   Used when the DOM object is going to be a block
 * @property {Symbol} text  Used when the DOM object is going to be a text
 */
export const DOMNodeType = VNodeType

function camelCaseToCSSStyle(str) {
    // Convert words to lower case and add hyphens around it (for stuff like "&")
    return str.replace(/[A-Z][a-z]*/g, str => '-' + str.toLowerCase() + '-')
            // remove double hyphens
            .replace('--', '-')
            // remove hyphens at the beginning and the end
            .replace(/(^-)|(-$)/g, '')
}

function replaceQuotes(str) {
    return str.replace(/\\'/g, "'").replace(/'/g, '"').replace(/\\"/g, '"').replace(/"/g, "\\\"")
}

/**
 * A class to represent the DOM node from the server side
 */
export class DOMNode {
    /**
     * @param {Object}         options
     * @param {String}         [options.text]       - Text if the node type will be text
     * @param {String}         [options.tag]        - Tag of the DOM node
     * @param {Array<DOMNode>} [options.body]       - Body of the node
     * @param {Object}         [options.styles]     - Styles that will be applied to the DOM node (key: value)
     * @param {Object}         [options.attributes] - Attributes that will be applied to the DOM node (key: value)
     */
    constructor({ text, tag, styles, attributes, body }) {
        if (tag || body || styles || attributes) {
            this.type = DOMNodeType.tag
            this.tag = tag || "div"
            this.body = Array.isArray(body) ? body : []
            this.styles = typeof styles === "object" ? styles : {}
            this.attributes = typeof attributes === "object" ? attributes : {}
        } else {
            this.type = DOMNodeType.text
            this.text = text || ""
        }
    }

    toString() {
        if (this.type === DOMNodeType.text) {
            return this.text
        }

        var attributesString = ""
        var stylesString = ""
        var bodyString = ""

        for (let attribute in this.attributes) {
            if (this.attributes[attribute] !== null && this.attributes[attribute] !== undefined) {
                attributesString += attribute.toString() + "=" + this.attributes[attribute].toString() + " "
            }
        }

        for (let style in this.styles) {
            if (this.styles[style] !== null && this.styles[style] !== undefined) {
                stylesString += camelCaseToCSSStyle(style.toString()) + ":" + replaceQuotes(this.styles[style].toString()) + ";"
            }
        }

        for (let child in this.body) {
            if (!(this.body[child] instanceof DOMNode)) {
                throw new Error("Unexpected child passed")
                return null
            }

            bodyString += this.body[child].toString()
        }

        return (`<${this.tag} ${attributesString} style='${stylesString}'>` + (["img", "br", "hr"].indexOf(this.tag) >= 0 ? "" : `${bodyString}</${this.tag}>`)).replace("  ", " ")
    }
}

/**
 * Class that contains methods to control the app
 * @class
 */
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
     */
    static loadFont({ name, url, weight = null, style = null }) {
        var descriptors = {}

        if (Weight.contains(weight)) {
            descriptors.weight = weightToCssValue(weight)
        }

        if (FontStyle.contains(style)) {
            descriptors.style = fontStyleToCssValue(style)
        }

        descriptors.name = name

        var font = new FontFace(name, `url(${url})`, descriptors)
        
        return font.load().then(loadedFont => {
            document.fonts.add(loadedFont)
        })
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

    /**
     * A method to use from the server side to render the static version of the app
     * @param {View} view View that will be rendered from the server side
     */
    static staticRender(view) {
        if (!(view instanceof View || view instanceof VNode)) {
            throw new Error("Expected view or vNode passed")
            return
        }

        var node = renderToVNode({ view: view, saveVNode: false, ignoreStateChange: true })

        var result = new DOMNode(node.type === VNodeType.tag ? {

            tag: node.tag,
            styles: node.styles,
            attributes: node.attributes,
            body: node.body.map(child => {
                return Application.staticRender(child)
            })

        } : { text: node.text })

        return result
    }
}
