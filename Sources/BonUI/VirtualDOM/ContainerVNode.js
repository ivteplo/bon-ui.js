//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewBuilder } from "../Application/ViewBuilder.js"
import { convertToViewBody, getClass, addSlashBeforeDoubleQuotes, camelCaseToHyphen, convertToViewBodyItem } from "../Values/Helpers.js"
import { View } from "../Views/View.js"
import { VNode } from "./VNode.js"
import "../jsdoc.js"


/**
 * Virtual DOM node that represents container (block) 
 */
export class ContainerVNode extends VNode {
    /**
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
            throw InvalidValueException(`"component" has to be string, ${getClass(component)} given.`)
        }

        this.component = component
        
        const obj = v => typeof v === "object" ? v : {}

        this.attributes = obj(attributes)
        this.handlers = obj(handlers)
        this.styles = obj(styles)
        this.lastBody = null
        this.body = body
    }
    
    /**
     * Method that returns body for current building
     * @param {*} builderConfig configuration to pass to the view builder
     */
    getCurrentBody (builderConfig) {
        var body = convertToViewBody(this.body)

        for (let i in body) {
            if (body[i] instanceof View) {
                body[i].parent = this.parentView || this
                body[i] = ViewBuilder.build(body[i], builderConfig)
                
                if (body[i] instanceof ContainerVNode) {
                    body[i].body = body[i].getCurrentBody(builderConfig)
                }
            } else if (body[i] instanceof VNode) {
                body[i].parentNode = this
            }
        }

        return body
    }

    toString () {
        const attributes = (
            Object.keys(this.attributes)
                .map(attr => `${attr}="${addSlashBeforeDoubleQuotes(this.attributes[attr])}"`)
                .join(" ")
        )

        const styles = (
            Object.keys(this.styles)
                .map(prop => `${camelCaseToHyphen(prop)}: ${addSlashBeforeDoubleQuotes(this.styles[prop])}`)
                .join("; ")
        )

        const body = (
            convertToViewBodyItem(this.body)
                .map(v => String(v))
                .join("")
        )
        
        return `<${this.component}${attributes ? ` ${attributes}` : ""}${styles ? ` style="${styles}"` : ""}>${body}</${this.component}>`
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

    /**
     * Method to update the DOM of the node
     * @param {VNode}   oldNode previous virtual DOM node
     */
    updateDomNode (oldNode) {
        const { dom } = oldNode

        if (oldNode instanceof ContainerVNode && oldNode.component === this.component) {
            oldNode.handleBeforeUpdate()
            
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
                    for (let i in this.handlers[event]) {
                        dom.addEventListener(event, this.handlers[event][i])
                    }
                } else {
                    dom.addEventListener(event, this.handlers[event])
                }
            }

            const idsUpdated = []
            const body = this.getCurrentBody({ action: "update", save: true })
            const oldBody = oldNode.lastBody

            if (oldBody.length !== body.length) {
                // updating children that have key specified
                for (let i in oldBody) {
                    let idFound = false
                    if ("id" in oldBody[i]) {
                        for (let j in body) {
                            if ("id" in oldBody[i] && body[j].id === oldBody[i].id) {
                                idFound = true
                                idsUpdated.push(body[j].id)
                                body[j].updateDomNode(oldBody[i])
                                break
                            }
                        }
                    }

                    if (!idFound) {
                        oldBody[i].handleBeforeUnmount()
                        oldBody[i].dom.parentNode.removeChild(oldBody[i].dom)
                        oldBody[i].handleUnmount()
                    }
                }

                // adding new children that haven't been mounted before
                for (let i in body) {
                    if (!("id" in body[i]) || ("id" in body[i] && idsUpdated.indexOf(body[i].id) < 0)) {
                        body[i].toDomNode({ save: true })
                        
                        if (i > 0) {
                            body[i - 1].dom.parentNode.insertBefore(body[i].dom, body[i - 1].dom.nextSibling)
                        } else {
                            dom.prepend(body[i].dom)
                        }
                    }
                }
            } else {
                for (let i in body) {
                    body[i].updateDomNode(oldBody[i])
                }
            }

            this.lastBody = body
            this.dom = dom
            oldNode.handleUpdate()
        } else {
            oldNode.handleBeforeUnmount()
            this.handleBeforeMount()
            const newDom = this.toDomNode({ save: true })
            dom.replaceWith(newDom)
            oldNode.handleUnmount()
            this.handleMount()
        }
    }
}