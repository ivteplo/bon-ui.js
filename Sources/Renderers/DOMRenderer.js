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

            bon-ui-application button, 
            bon-ui-application input, 
            bon-ui-application textarea {
                background: transparent;
                border: none;
                outline: none;
            }

            bon-ui-application input, 
            bon-ui-application textarea {
                width: 100%;
            }

            bon-ui-application input::placeholder, 
            bon-ui-application textarea::placeholder,
            bon-ui-application button, 
            bon-ui-application input, 
            bon-ui-application textarea {
                font-size: 1rem;
                font-family: inherit;
            }

            bon-ui-application {
                height: 100%;
                transition: color 0.25s, background 0.25s;
            }

            bon-ui-scene {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background: inherit;
                color: inherit;
                overflow-y: auto;
            }

            bon-ui-spacer {
                flex-shrink: 0;
            }

            bon-ui-row,
            bon-ui-column {
                display: flex;
                justify-content: center;
            }

            bon-ui-row {
                flex-direction: row;
            }

            bon-ui-column {
                flex-direction: column;
            }
        `)
        document.head.prepend(styles)

        class BonUIApplicationElement extends HTMLElement {}

        class BonUISceneElement extends HTMLElement {
            connectedCallback () {
                if (this.childNodes[0].clientHeight > window.screen.height) {
                    this.style.alignItems = "flex-start"
                }
            }
        }

        class BonUIColumnElement extends HTMLElement {
            constructor () {
                super()
                this._haveSetMinHeight = false
                this._haveSetMinWidth = false
            }

            checkIfHasSpacer () {
                const spacers = this.querySelectorAll(":scope > bon-ui-spacer, :scope > textarea, :scope > input")
                if (spacers.length === 0) {
                    return false
                }

                let hasSpacersWithoutHeightSet = false
                for (let spacer of spacers) {
                    if (!spacer.style.height) {
                        hasSpacersWithoutHeightSet = true
                        break
                    }
                }

                return hasSpacersWithoutHeightSet
            }

            updateSizes () {
                if (!this.style.minHeight || this._haveSetMinHeight) {
                    const hasSpacer = this.checkIfHasSpacer()
                    if (hasSpacer) {
                        this._haveSetMinHeight = true
                        this.style.minHeight = "100%"
                        this.style.boxSizing = "border-box"
                    }
                }

                if (!this.style.minWidth || this._haveSetMinWidth) {
                    const childRowSpacers = this.querySelectorAll("bon-ui-row > bon-ui-spacer, bon-ui-row > textarea, bon-ui-row > input")
                    if (childRowSpacers.length > 0) {
                        if (childRowSpacers[0].parentNode.checkIfHasSpacer() === true && !this.style.minWidth) {
                            this._haveSetMinWidth = true
                            this.style.minWidth = "100%"
                            this.style.boxSizing = "border-box"
                        }
                    }
                }

                if (!this.style.minWidth || this._haveSetMinWidth) {
                    const childRowsOrColumns = this.querySelectorAll("bon-ui-column")
                    for (let child of childRowsOrColumns) {
                        if (child.style.minWidth === "100%") {
                            this._haveSetMinWidth = true
                            this.style.minWidth = "100%"
                            break
                        }
                    }
                }
            }

            updateParents () {
                var parent = this.parentNode
                while (parent) {
                    if (parent instanceof BonUIColumnElement) {
                        parent.updateSizes()
                        parent.updateParents()
                        break
                    } else {
                        parent = parent.parentNode
                    }
                }
            }

            connectedCallback () {
                this.updateSizes()
            }

            disconnectedCallback () {
                this.updateParents()
            }
        }

        class BonUIRowElement extends BonUIColumnElement {
            checkIfHasSpacer () {
                const spacers = this.querySelectorAll(":scope > bon-ui-spacer, :scope > textarea, :scope > input")
                if (spacers.length === 0) {
                    return false
                }

                let hasSpacersWithoutWidthSet = false
                for (let spacer of spacers) {
                    if (!spacer.style.width) {
                        hasSpacersWithoutWidthSet = true
                        break
                    }
                }

                return hasSpacersWithoutWidthSet
            }

            updateSizes () {
                if (!this.style.minWidth || this._haveSetMinWidth) {
                    const hasSpacer = this.checkIfHasSpacer()
                    if (hasSpacer) {
                        this._haveSetMinWidth = true
                        this.style.minWidth = "100%"
                        this.style.boxSizing = "border-box"
                    }
                }

                if (!this.style.minHeight || this._haveSetMinHeight) {
                    const childColumnSpacers = this.querySelectorAll("bon-ui-column > bon-ui-spacer, bon-ui-column > textarea, bon-ui-column > input")
                    if (childColumnSpacers.length > 0) {
                        if (childColumnSpacers[0].parentNode.checkIfHasSpacer() === true) {
                            this._haveSetMinHeight = true
                            this.style.minHeight = "100%"
                            this.style.boxSizing = "border-box"
                        }
                    }
                }

                if (!this.style.minHeight || this._haveSetMinHeight) {
                    const childRowsOrColumns = this.querySelectorAll("bon-ui-column")
                    for (let child of childRowsOrColumns) {
                        if (child.style.minHeight === "100%") {
                            this.style.minHeight = "100%"
                            this._haveSetMinHeight = true
                            break
                        }
                    }
                }
            }

            connectedCallback () {
                this.updateSizes()
            }
        }

        class BonUISpacerElement extends HTMLElement {
            updateParents () {
                var parent = this.parentNode
                while (parent) {
                    if (parent instanceof BonUIColumnElement) {
                        parent.updateSizes()
                        parent.updateParents()
                        break
                    } else {
                        parent = parent.parentNode
                    }
                }
            }

            connectedCallback () {
                this.updateParents()
            }

            disconnectedCallback () {
                this.updateParents()
            }
        }

        customElements.define("bon-ui-application", BonUIApplicationElement)
        customElements.define("bon-ui-scene", BonUISceneElement)
        customElements.define("bon-ui-column", BonUIColumnElement)
        customElements.define("bon-ui-row", BonUIRowElement)
        customElements.define("bon-ui-spacer", BonUISpacerElement)
    }
}

function addSlashBeforeDoubleQuotes (value) {
    return String(value).replace(/"/g, '\\"')
}
