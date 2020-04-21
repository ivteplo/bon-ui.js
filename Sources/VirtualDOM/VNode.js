//
// VNode.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../Views/View"
import { Enum } from "../Values/Enum"

/**
 * A list of virtual node types
 * @enum
 * @property {Symbol} tag   Used when the real DOM object is going to be a block
 * @property {Symbol} text  Used when the real DOM object is going to be a text
 */
export const VNodeType = new Enum("tag", "text")

/**
 * A node of the Virtual DOM
 * @class
 */
export class VNode {
    /**
     * @param {Object}              options
     * @param {String|Number}       [options.key]           Key of the virtual node to make the reconcilation of the component faster
     * @param {String}              [options.text]          Text if the virtual node type will be text
     * @param {String}              [options.tag]           Tag of the real DOM node
     * @param {Array<View|VNode>}   [options.body]          Body of the node
     * @param {Object}              [options.styles]        Styles that will be applied to the real DOM node (key: value)
     * @param {Object}              [options.events]        Events of the real DOM node that will be handled by the handlers (key: handlers, where `handlers` is the array of functions)
     * @param {Object}              [options.attributes]    Attributes that will be applied to the real DOM node (key: value)
     * @param {View|null}           view                    The view (if this node is the result of rendering of view)
     */
    constructor ({ text, tag, key, body, styles, events, attributes }, view = null) {
        if (tag || body || styles || events || attributes) {
            this.type = VNodeType.tag
            this.tag = tag || "div"
            this.body = Array.isArray(body) ? body : []
            this.styles = typeof styles === "object" ? styles : {}
            this.events = typeof events === "object" ? events : {}
            this.attributes = typeof attributes === "object" ? attributes : {}
        } else {
            this.type = VNodeType.text
            this.text = text || ""
        }

        this.dom = null
        this.view = view
        this.key = key || null
    }

    /**
     * A method that converts the VNode to the DOM object
     * @param       {Object}        options
     * @param       {Boolean}       [options.save]  Save the real DOM node to the variable or not
     * @returns     {Node|null}     Returns null if there is an error while rendering the child nodes
     */
    toHTMLNode({ save=true }) {
        var result

        if (this.type === VNodeType.text) {
            result = document.createTextNode(this.text)
        } else {
            result = document.createElement(this.tag)
        
            for (let child of this.body) {
                if (child === null) {
                    continue
                }

                if (!(child instanceof VNode)) {
                    throw new Error("Expected the instance of VNode passed as a child component")
                }

                if (child.dom instanceof Node) {
                    let childClone = Object.create(child)
                    childClone.dom = null
                    childClone.mountTo(result)
                } else {
                    child.mountTo(result)
                }
            }
            
            for (let i in this.styles) {
                result.style[i] = this.styles[i] !== null && this.styles[i] !== undefined ? this.styles[i].toString() : ""
            }

            for (let i in this.events) {
                for (let handler of this.events[i]) {
                    if (typeof handler === "function") {
                        result.addEventListener(i, handler)
                    }
                }
            }

            for (let i in this.attributes) {
                result.setAttribute(i, this.attributes[i])
            }
        }

        if (save) {
            this.dom = result
        }

        return result
    }

    /**
     * A method to mount the virtual DOM node to the parent
     * @param {Node} parent Parent where to mount the node
     */
    mountTo (parent) {
        if (this.dom instanceof Node && this.dom.parentElement instanceof Node) {
            throw new Error("VNode is already mounted")
        }

        this.dom = this.toHTMLNode({ save: true })

        if (this.dom === null) {
            throw new Error("Error while creating the DOM node of the view")
        }

        parent.appendChild(this.dom)

        if (this.view instanceof View) {
            this.view.handleMount()
        }
    }

    /**
     * A method to unmount the virtual node
     */
    unmount() {
        if (this.dom instanceof Node && this.dom.parentElement instanceof Node) {
            if (this.view instanceof View) {
                this.view.handleUnmount()
            }

            this.dom.parentElement.removeChild(this.dom)
        }
    }

    /**
     * A method to convert the virtual node to HTML string
     */
    toString() {
        if (this.type === VNodeType.text) {
            return this.text
        }

        var attributesString = ""
        var stylesString = ""
        var bodyString = ""

        for (let attribute in this.attributes) {
            if (this.attributes[attribute] !== null && this.attributes[attribute] !== undefined) {
                attributesString += `${attribute.toString()}="${this.attributes[attribute].toString()}"`
            }
        }

        for (let style in this.styles) {
            if (this.styles[style] !== null && this.styles[style] !== undefined) {
                stylesString += camelCaseToCSSStyle(style.toString()) + ":" + replaceQuotes(this.styles[style].toString()) + ";"
            }
        }

        for (let child in this.body) {
            if (!(this.body[child] instanceof VNode)) {
                throw new Error("Unexpected child passed")
                return null
            }

            bodyString += this.body[child].toString()
        }

        return (`<${this.tag} ${attributesString} style='${stylesString}'>` + (["img", "br", "hr"].indexOf(this.tag) >= 0 ? "" : `${bodyString}</${this.tag}>`)).replace("  ", " ")
    }
}

function camelCaseToCSSStyle(str) {
    // Convert words to lower case and add hyphens around it (for stuff like "&")
    return str.replace(/[A-Z][a-z]*/g, str => '-' + str.toLowerCase() + '-')
            // remove double hyphens
            .replace('--', '-')
            // remove hyphens at the beginning and the end
            .replace(/(^-)|(-$)/g, '')
}

function replaceQuotes(str) {
    return str.replace(/\\'/g, "'").replace(/'/g, '"').replace(/\\"/g, '"').replace(/"/g, "'")
}


