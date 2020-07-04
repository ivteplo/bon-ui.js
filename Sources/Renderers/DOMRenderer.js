//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { createColorSchemeState } from "../BonUI/Values/Color.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { Renderer } from "./Renderer.js"

/**
 * Class that has methods for rendering virtual DOM to real DOM
 * @class
 */
export class DOMRenderer extends Renderer {
    /**
     * Method to render VNode or string to document node
     * @param   {VNode|string|number} node 
     * @returns {Node}
     */
    static render (node, { save = false } = {}) {
        if (typeof node === "string" || typeof node === "number") {
            return document.createTextNode(node)
        } else if (!node) {
            return
        }

        var result
        
        if (!node.xmlNamespace) {
            result = document.createElement(node.tag)
        } else {
            result = document.createElementNS(node.xmlNamespace, node.tag)
        }

        for (let [ key, value ] of Object.entries(node.attributes)) {
            result.setAttribute(key, value)
        }

        for (let [ key, value ] of Object.entries(node.styles)) {
            result.style[key] = value
        }

        for (let key in node.handlers) {
            if (Array.isArray(node.handlers[key])) {
                for (let i in node.handlers[key]) {
                    result.addEventListener(key, node.handlers[key][i])
                }
            } else {
                result.addEventListener(key, node.handlers[key])
            }
        }

        if (Array.isArray(node.body)) {
            for (let child of node.body) {
                this.mount(child, result)
            }
        } else if (body) {
            this.mount(body, result)
        }

        if (save) {
            node.built = result
            node.renderer = this
        }

        return result
    }

    /**
     * Method to update DOM of virtual DOM node
     * @param {VNode} newNode 
     * @param {VNode} oldNode 
     * @param {Node} dom 
     */
    static update (newNode, oldNode, dom) {
        if (newNode === undefined || newNode === null) {
            dom.parentNode.removeChild(dom)
            return
        }

        if (!(newNode instanceof VNode) || !(oldNode instanceof VNode) || oldNode.tag !== newNode.tag) {
            if (oldNode instanceof VNode) {
                oldNode.handleWillDisappear()
            }

            if (newNode instanceof VNode) {
                newNode.handleWillAppear()
            }

            const newDom = this.render(newNode, { save: true })
            dom.replaceWith(newDom)

            if (newNode instanceof VNode) {
                newNode.handleDidAppear()
            }

            if (oldNode instanceof VNode) {
                oldNode.handleDidDisappear()
            }

            return
        }

        oldNode.handleWillUpdate()

        const diff = VNode.diff(newNode, oldNode)

        for (let change of diff.attributes) {
            switch (change.todo) {
                case "remove":
                    dom.removeAttribute(change.key)
                    break
                case "update":
                    dom.setAttribute(change.key, change.newValue)
                    break
            }
        }

        for (let change of diff.styles) {
            switch (change.todo) {
                case "remove":
                    dom.style[change.key] = ""
                    break
                case "update":
                    dom.style[change.key] = change.newValue
            }
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

        for (let event in newNode.handlers) {
            if (Array.isArray(newNode.handlers[event])) {
                for (let i in newNode.handlers[event]) {
                    dom.addEventListener(event, newNode.handlers[event][i])
                }
            } else {
                dom.addEventListener(event, newNode.handlers[event])
            }
        }

        if (oldNode.body.length < newNode.body.length) {
            for (let i = newNode.body.length - 1; i >= 0; --i) {
                if (!(i in oldNode.body)) {
                    this.render(newNode.body[i], { save: true })
                    
                    if (!newNode.body[i].built) {
                        continue
                    }
                    
                    newNode.body[i].handleWillAppear()

                    if (i === newNode.body.length - 1) {
                        dom.appendChild(newNode.body[i].built)
                    } else {
                        dom.insertBefore(newNode.body[i].built, newNode.body[i + 1].built)
                    }

                    newNode.body[i].handleDidAppear()
                } else {
                    this.update(newNode.body[i], oldNode.body[i], dom.childNodes[i])
                }
            }
        } else {
            for (let i = oldNode.body.length - 1; i >= 0; --i) {
                if (!(i in newNode.body)) {
                    oldNode.body[i].handleWillDisappear()
                    dom.removeChild(dom.childNodes[i])
                    oldNode.body[i].handleDidDisappear()
                } else {
                    this.update(newNode.body[i], oldNode.body[i], dom.childNodes[i])
                }
            }
        }

        if (oldNode.built) {
            newNode.built = dom
            newNode.renderer = this
        }

        oldNode.handleDidUpdate()
    }

    /**
     * Method to convert virtual DOM node to HTML code string
     * @param {VNode} vNode 
     */
    static vNodeToHTMLString (vNode) {
        var result = `<${vNode.tag}`

        for (let [ key, value ] of Object.entries(vNode.attributes)) {
            result += ` ${key}="${addSlashBeforeDoubleQuotes(value)}"`
        }

        var styles = ""

        for (let [ key, value ] of Object.entries(vNode.styles)) {
            styles += `${key}: ${value}; `
        }

        if (styles) {
            result += ` styles="${addSlashBeforeDoubleQuotes(styles).trim()}"`
        }

        result += ">"

        var body = vNode.body

        if (!Array.isArray(body)) {
            body = body ? [ body ] : []
        }

        for (let child of body) {
            result += `\n\t${child.toString()}`
        }

        result += `${body.length > 0 ? "\n" : ""}</${vNode.tag}>`
        return result
    }

    /**
     * Method to mount the virtual DOM node to the container
     * @param {VNode} vNode 
     * @param {Node}  container
     */
    static mount (vNode, container = document.body) {
        const dom = this.render(vNode, { save: true })

        if (!dom) {
            return
        }

        if (vNode instanceof VNode) {
            vNode.handleWillAppear()
        }

        container.appendChild(dom)

        if (vNode instanceof VNode) {
            vNode.handleDidAppear()
        }
    }

    static prepare () {
        const styles = document.createElement("style")
        styles.innerHTML = (`
            * {
                margin: 0;
                padding: 0;
            }

            :root {
                font-family: sans-serif;
                font-size: 16px;
            }

            html, body {
                height: 100%;
            }

            button, input, textarea {
                background: transparent;
                border: none;
                outline: none;
            }

            input::placeholder, textarea::placeholder,
            button, input, textarea {
                font-size: 1rem;
                font-family: inherit;
            }
        `)
        document.head.prepend(styles)
    }
}

function addSlashBeforeDoubleQuotes (value) {
    return String(value).replace(/"/g, '\\"')
}
