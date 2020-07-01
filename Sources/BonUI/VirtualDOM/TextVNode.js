//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VNode } from "./VNode.js"

/**
 * Virtual DOM node that represents Text node
 */
export class TextVNode extends VNode {
    /**
     * @param {string|number} text 
     */
    constructor (text) {
        super()
        this.text = text
    }

    toString () {
        return String(this.text instanceof Function ? this.text() : this.text)
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

        const result = document.createTextNode(this.toString())

        if (save) {
            this.dom = result
            this.handleMount()
        }

        return result
    }

    /**
     * Method to update the DOM of the node
     * @param {VNode}   oldNode previous virtual DOM node
     */
    updateDomNode (oldNode) {
        const { dom } = oldNode
        
        if (oldNode instanceof TextVNode) {
            if (oldNode.text !== this.text) {
                oldNode.handleBeforeUpdate()
                dom.textContent = this.text
                oldNode.handleUpdate()
            }
        } else {
            oldNode.handleBeforeUnmount()
            const newDom = this.toDomNode({ save: true })
            dom.replaceWith(newDom)
            oldNode.handleUnmount()
        }

        this.dom = dom
    }
}
