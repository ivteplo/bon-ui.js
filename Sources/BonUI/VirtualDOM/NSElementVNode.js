//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { ContainerVNode } from "./ContainerVNode.js"
import { VNode } from "./VNode.js"
import "../jsdoc.js"


/**
 * Virtual DOM node that represents blocks that have to be created with createElementNS
 */
export class NSElementVNode extends ContainerVNode {
    /**
     * 
     * @param {*} containerVNodeOptions 
     * @param {string} xmlNamespace "xmlns" value
     */
    constructor (containerVNodeOptions, xmlNamespace) {
        super(containerVNodeOptions)
        this.xmlNamespace = xmlNamespace.toString()
    }

    /**
     * Method to convert virtual DOM node to real DOM node
     * @param {*}       options
     * @param {boolean} [options.save] save the DOM node to the virtual DOM node or not (`false` by default)
     */
    toDomNode ({ save = false } = {}) {
        this.handleBeforeMount()
        if (typeof document !== "object") {
            throw new InvalidValueException(`Expected "document" to be object, got ${typeof document}`)
        }

        const result = document.createElementNS(this.xmlNamespace, this.component)
        for (let property in this.styles) {
            result.style[property] = this.styles[property]
        }

        for (let attribute in this.attributes) {
            result.setAttributeNS(null, attribute, this.attributes[attribute])
        }

        for (let event in this.handlers) {
            if (Array.isArray(this.handlers[event])) {
                for (let i in this.handlers[event]) {
                    result.addEventListener(event, this.handlers[event][i])
                }
            } else {
                result.addEventListener(event, this.handlers[event])
            }
        }

        const body = this.getCurrentBody({ action: "mount", save })

        for (let i in body) {
            if (!(body[i] instanceof VNode)) {
                throw new InvalidValueException(`Expected virtual DOM node as a child, got ${body[i].constructor.name}`)
            }
            
            result.appendChild(body[i].toDomNode({ save }))
        }

        if (save) {
            this.dom = result
            this.lastBody = body
            this.handleMount()
        }

        return result
    }
}