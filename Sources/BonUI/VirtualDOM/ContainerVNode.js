//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VNode } from "./VNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { flattenArray } from "../Values/Array.js"

const camelCaseToHyphen = v => {
    var result = v.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase())
    while (result.length > 0 && result[0] === "-") {
        result = result.substr(1)
    } 
    
    while (result.length > 0 && result[result.length - 1] === "-") {
        result = result.slice(0, -1)
    }

    return result
}

const replaceDoubleQuotes = v => v.replace(/"/g, "\\\"")

/**
 * Virtual DOM node that represents container (block) 
 */
export class ContainerVNode extends VNode {
    /**
     * @typedef {function|[VNode]} Body
     * 
     * @param {*}       options
     * @param {string}  [options.component]     tag of the block
     * @param {*}       [options.attributes]    attributes of the block
     * @param {*}       [options.styles]        styles of the block
     * @param {*}       [options.handlers]      handlers (event listeners) of the block
     * @param {Body}    [options.body]          children or getter
     */
    constructor ({ component = "div", attributes = {}, styles = {}, handlers = {}, body = [] } = {}) {
        super()

        if (typeof component !== "string") {
            throw InvalidValueException(`"component" has to be string, ${typeof component} given.`)
        }

        this.component = component
        
        const obj = v => typeof v === "object" ? v : {}

        this.attributes = obj(attributes)
        this.handlers = obj(handlers)
        this.styles = obj(styles)
        this.body = typeof body === "function" || Array.isArray(body) ? body : [ body ]
        this.lastBody = null
        this.nodeHandlers = {
            mount: [],
            update: []
        }
    }
    
    get currentBody () {
        var body = this.body
        if (typeof body === "function") {
            body = body()
        }

        if (!Array.isArray(body)) {
            body = [ body ]
        }

        body = flattenArray(body).filter(v => v != null)
        return body
    }

    onMount (handler) {
        this.nodeHandlers.mount.push(handler)
        return this
    }

    onUpdate (handler) {
        this.nodeHandlers.update.push(handler)
        return this
    }

    toString () {
        const attributes = Object.keys(this.attributes).map(attr => `${attr}="${replaceDoubleQuotes(this.attributes[attr])}"`).join(" ")
        const styles = Object.keys(this.styles).map(prop => `${camelCaseToHyphen(prop)}: ${replaceDoubleQuotes(this.styles[prop])}`).join(";")
        var body = typeof this.body === "function" ? this.body() : this.body
        body = Array.isArray(body) ? body : [ body ]
        body = body.map(v => String(v)).join("")
        return `<${this.component}${attributes ? ` ${attributes}` : ""}${styles ? ` style="${styles}"` : ""}>${body}</${this.component}>`
    }

    /**
     * Method to convert virtual DOM node to real DOM node
     * @param {*}       options
     * @param {boolean} [options.save] save the DOM node to the virtual DOM node or not (`false` by default)
     */
    toDomNode ({ save = false } = {}) {
        if (typeof document !== "object") {
            throw new InvalidValueException(`Expected "document" to be object, got ${typeof document}`)
        }

        const result = document.createElement(this.component)
        for (let property in this.styles) {
            result.style[property] = this.styles[property]
        }

        for (let attribute in this.attributes) {
            result.setAttribute(attribute, this.attributes[attribute])
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

        const body = this.currentBody

        for (let i in body) {
            if (!(body[i] instanceof VNode)) {
                throw new InvalidValueException(`Expected virtual DOM node as a child, got ${body[i].constructor.name}`)
            }
            
            result.appendChild(body[i].toDomNode({ save }))
        }

        if (save) {
            this.dom = result
            this.lastBody = body
            
            for (let handler of this.nodeHandlers.mount) {
                handler()
            }
        }

        return result
    }

    /**
     * Method to update the DOM of the node
     * @param {VNode}   oldNode previous virtual DOM node
     * @param {Node}    dom     current DOM
     */
    updateDomNode (oldNode, dom) {
        if (oldNode instanceof ContainerVNode && oldNode.component === this.component) {
            for (let property in oldNode.styles) {
                if (!(property in this.styles)) {
                    dom.style[property] = ""
                }
            }

            for (let property in this.styles) {
                dom.style[property] = this.styles[property]
            }

            for (let attribute in oldNode.attributes) {
                if (!(attribute in this.attributes)) {
                    dom.removeAttribute(attribute)
                }
            }

            for (let attribute in this.attributes) {
                dom.setAttribute(attribute, this.attributes[attribute])
            }

            for (let event in oldNode.handlers) {
                if (Array.isArray(oldNode.handlers[event])) {
                    for (let i in oldNode.handlers[event]) {
                        dom.removeEventListener(event, oldNode.handlers[event][i])
                    }
                } else {
                    dom.removeEventListener(event, oldNode.handlers[event])
                }
            }

            for (let event in this.handlers) {
                if (Array.isArray(this.handlers[event])) {
                    dom.addEventListener(event, this.handlers[event][i])
                } else {
                    dom.addEventListener(event, this.handlers[event])
                }
            }

            const keysUpdated = []
            const body = this.currentBody
            const oldBody = oldNode.lastBody

            // updating children that have key specified
            for (let i in oldBody) {
                let keyFound = false
                if ("key" in oldBody[i]) {
                    for (let j in body) {
                        if ("key" in oldBody[i] && body[j].key === oldBody[i].key) {
                            keyFound = true
                            keysUpdated.push(body[j].key)
                            body[j].updateDomNode(oldBody[i], oldBody[i].dom)
                            break
                        }
                    }
                }

                if (!keyFound) {
                    oldBody[i].dom.parentNode.removeChild(oldBody[i].dom)
                }
            }

            // adding new children that haven't been mounted before
            for (let i in body) {
                if (!("key" in body[i]) || ("key" in body[i] && keysUpdated.indexOf(body[i].key) < 0)) {
                    body[i].toDomNode({ save: true })
                    
                    if (i > 0) {
                        body[i - 1].dom.parentNode.insertBefore(body[i].dom, body[i - 1].dom.nextSibling)
                    } else {
                        dom.prepend(body[i].dom)
                    }
                }
            }

            this.lastBody = body
            this.dom = dom
        } else {
            const newDom = this.toDomNode({ save: true })
            dom.replaceWith(newDom)
        }

        for (let handler of this.nodeHandlers.update) {
            handler()
        }
    }
}
