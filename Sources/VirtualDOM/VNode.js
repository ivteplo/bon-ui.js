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
 * @public @enum
 */
export const VNodeType = new Enum("tag", "text")

/**
 * @public @class
 * @description A node of the Virtual DOM
 */
export class VNode {
    /**
     * @param {{
     *  tag: string,
     *  body: (VNode|View|string)[],
     *  styles: object,
     *  events: object,
     *  attriutes: object
     * }} param0 
     */
    constructor ({ text, tag, body, styles, events, attributes }) {
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
    }

    /**
     * @description This method converts the VNode to the DOM object
     * @returns {Node|null} Returns null if there is an error while rendering the child nodes
     */
    toHTMLNode ({ save=true }) {
        var result

        if (this.type === VNodeType.text) {
            result = document.createTextNode(this.text)
        } else {
            result = document.createElement(this.tag)
        
            for (let child of this.body) {
                if (!(child instanceof VNode)) {
                    throw new Error("Expected the instance of VNode passed as a child component")
                }

                child.mountTo(result)
            }
            
            for (let i in this.styles) {
                result.style[i] = this.styles[i] !== null && this.styles[i] !== undefined ? this.styles[i].toString() : ""
            }

            for (let i in this.events) {
                if (typeof this.events[i] === "function") {
                    result.addEventListener(i, this.events[i])
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
     * @description A method to mount to the parent
     * @param {Node} parent 
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
    }
}

/**
 * @description A function to render view until body returns VNode
 * @param {View|VNode} view
 */
export function renderToVNode (view) {
    let node

    if (view instanceof VNode) {
        node = view
    } else {
        node = view.getBody()

        while (node instanceof View) {
            node = node.getBody()
        }
        
        if (!(node instanceof VNode)) {
            throw new Error("Expected a VNode as the result of rendering the View (the rendering is recursive, so the error can be in the parent class or in the child class)")
        }
    }

    for (let i in node.body) {
        if (node.body[i] instanceof View || node.body[i] instanceof VNode) {
            node.body[i] = renderToVNode(node.body[i])
        } else {
            throw new Error("Unexpected child passed")
        }
    }

    return node
}
