//
// View.js
// Created on 06/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { OutlineStyle, outlineStyleToCssValue } from "../Values/OutlineStyle"
import { Positioning, positioningToCssValue } from "../Values/Positioning"
import { VNode, VNodeType, renderToVNode } from "../VirtualDOM/VNode"
import { Reconciler } from "../VirtualDOM/Reconciler"
import { Length, pixels } from "../Values/Length"
import { ViewState } from "./ViewState"
import { Color } from "../Values/Color"
import { Font } from "../Values/Font"

// function updateComponentDOM is described after the class View

function isValidLength(value) {
    return value instanceof Length || value instanceof Number || typeof value === "number"
}

function toLength(value) {
    return value instanceof Length ? value : pixels(value)
}

function isString(value) {
    return value instanceof String || typeof value === "string"
}

/**
 * @public @class
 * @description An UI item
 */
export class View {
    constructor () {
        this.lastVNode = null
        this.mounted = false
        this.styles = {}
        this.events = {}
        this.attributes = {}
        this.state = new ViewState()
        this.restoreState()
        
        Object.defineProperty(this, "mounted", {
            get: () => {
                return this.lastVNode instanceof VNode && this.lastVNode.dom instanceof Node
            },
            set: () => {}
        })
    }

    /**
     * @description A method that returns the key->value object, which will be transformed into the state
     * @example
     * class Test extends View {
     *  getInitialState() {
     *      return {
     *          test: true
     *      }
     *  }
     * }
     * @returns {object}
     */
    getInitialState () {
        return {}
    }

    /**
     * @description A method to restore the initial state
     */
    restoreState () {
        this.state.restore()
        var initialState = this.getInitialState()
        if (typeof initialState === "object") {
            for (let key in initialState) {
                let response = this.state.set(key, initialState[key])

                if (!response.updated) {
                    throw new Error(response.toString())
                }
            }
        }

        this.state.setChangeHandler(() => {
            this.invalidate()
        })
    }

    /**
     * @description A method that returns the body (content) of the view
     * @override
     */
    getBody () {
        var { styles, attributes, events } = this

        return new VNode({
            tag: "div",
            styles: styles,
            events: events,
            attributes: attributes
        })
    }

    /**
     * @description A method called after mounting
     */
    handleMount() {}

    /**
     * @description A method called after invalidation
     */
    handleInvalidation() {}

    /**
     * @description A method to mount the view
     * @param {Node} parent 
     */
    mountTo (parent = document.body) {
        if (this.mounted) {
            throw new Error("The view is already mounted")
        }

        if (!(parent instanceof Node)) {
            throw new Error("The parent is not an instance of Node")
        }

        Reconciler.addUnitOfWork(() => {
            renderToVNode(this, true)
            this.lastVNode.mountTo(parent)
            this.handleMount()
        })
    }

    /**
     * @description A method to force reload the view
     */
    invalidate () {
        if (this.mounted) {
            Reconciler.addUnitOfWork(() => {
                let vNode = renderToVNode(this)
                updateComponentDOM(this.lastVNode, vNode)
                this.lastVNode = vNode
                this.handleInvalidation()
            })
        }
    }

    /**
     * @description A method to force reload the view without waiting
     */
    forceInvalidate () {
        if (this.mounted) {
            let vNode = renderToVNode(this)
            updateComponentDOM(this.lastVNode, vNode)
            this.lastVNode = vNode
            this.handleInvalidation()
        }
    }

    //
    // Styling section
    //

    /**
     * @description A method to set the ability to select the component's text/image to true or false
     * @param {Boolean} value 
     */
    setSelectableTo (value) {
        if (typeof value === "boolean" || value instanceof Boolean) {
            this.styles.userSelect = Boolean(value) ? "auto" : "none"
        }

        return this
    }

    /**
     * @description A method to set the foreground properties
     * @param {{
     *  color: Color
     * }} param0 
     */
    setForeground ({ color }) {
        if (color instanceof Color) {
            this.styles.color = color
        }

        return this
    }

    /**
     * @description A method to set the background properties
     * @param {{
     *  color: Color
     * }} param0 
     */
    setBackground({ color }) {
        if (color instanceof Color) {
            this.styles.backgroundColor = color
        }

        return this
    }

    /**
     * @description A method to set the handler for the event
     * @param {{
     *  event: string,
     *  handler: function
     * }} param0 
     */
    setHandlerFor ({ event, handler }) {
        if (isString(event) && typeof handler === "function") {
            if (!(event in this.events)) {
                this.events[event] = []
            }

            this.events[event].push(handler)
        }

        return this
    }

    /**
     * @description A method to set the font properties
     * @param {Font} font 
     */
    setFont (font) {
        if (font instanceof Font) {
            this.styles.font = font
        }

        return this
    }

    /**
     * @description A method to change the offset of the view
     * @param {{
     *  all: Length|number,
     *  top: Length|number,
     *  right: Length|number,
     *  bottom: Length|number,
     *  left: Length|number
     * }} param0 
     */
    setOffset ({ all, top, right, bottom, left }) {
        if (isValidLength(all)) {
            this.styles.margin = toLength(all)
        }

        if (isValidLength(top)) {
            this.styles.marginTop = toLength(top)
        }

        if (isValidLength(right)) {
            this.styles.marginRight = toLength(right)
        }

        if (isValidLength(bottom)) {
            this.styles.marginBottom = toLength(bottom)
        }

        if (isValidLength(left)) {
            this.styles.marginLeft = toLength(left)
        }

        return this
    }

    /**
     * @description A method to change the padding of the view
     * @param {{
     *  all: Length|number,
     *  top: Length|number,
     *  right: Length|number,
     *  bottom: Length|number,
     *  left: Length|number
     * }} param0 
     */
    setPadding ({ all, top, right, bottom, left }) {
        if (isValidLength(all)) {
            this.styles.padding = toLength(all)
        }

        if (isValidLength(top)) {
            this.styles.paddingTop = toLength(top)
        }

        if (isValidLength(right)) {
            this.styles.paddingRight = toLength(right)
        }

        if (isValidLength(bottom)) {
            this.styles.paddingBottom = toLength(bottom)
        }

        if (isValidLength(left)) {
            this.styles.paddingLeft = toLength(left)
        }

        return this
    }

    /**
     * 
     * @param {{
     *  left: number|Length,
     *  top: number|Length,
     *  right: number|Length,
     *  bottom: number|Length,
     *  all: number|Length,
     *  color: Color,
     *  style: Symbol,
     *  radius: number|Length
     * }} param0
     */
    setOutline ({ left, top, right, bottom, all, color, style, radius }) {
        if (isValidLength(all)) {
            this.styles.borderWidth = toLength(all)
        }

        if (isValidLength(left)) {
            this.styles.borderLeftWidth = toLength(left)
        }

        if (isValidLength(right)) {
            this.styles.borderRightWidth = toLength(right)
        }

        if (isValidLength(top)) {
            this.styles.borderTopWidth = toLength(top)
        }

        if (isValidLength(bottom)) {
            this.styles.borderBottomWidth = toLength(bottom)
        }

        if (isValidLength(radius)) {
            this.styles.borderRadius = toLength(radius)
        } else if (Array.isArray(radius)) {
            this.styles.borderRadius = radius.map(item => {
                return toLength(item)
            }).join(" ")
        }

        if (color instanceof Color) {
            this.styles.borderColor = color
        }

        if (OutlineStyle.contains(style)) {
            this.styles.borderStyle = outlineStyleToCssValue(style)
        }

        return this
    }

    /**
     * @description A method to set the size of the view
     * @param {{
     *  width: Length|number,
     *  height: Length|number
     * }} param0 
     */
    setSize({ width, height }) {
        if (isValidLength(width)) {
            this.styles.width = toLength(width)
        }

        if (isValidLength(height)) {
            this.styles.height = toLength(height)
        }

        return this
    }

    /**
     * @description A method to set the minimal size of the view
     * @param {{
     *  width: Length|number,
     *  height: Length|number
     * }} param0 
     */
    setMinSize({ width, height }) {
        if (isValidLength(width)) {
            this.styles.minWidth = toLength(width)
        }

        if (isValidLength(height)) {
            this.styles.minHeight = toLength(height)
        }

        return this
    }

    /**
     * @description A method to set the maximal size of the view
     * @param {{
     *  width: Length|number,
     *  height: Length|number
     * }} param0 
     */
    setMaxSize({ width, height }) {
        if (isValidLength(width)) {
            this.styles.maxWidth = toLength(width)
        }

        if (isValidLength(height)) {
            this.styles.maxHeight = toLength(height)
        }

        return this
    }

    /**
     * @description A method to set the positioning of the View 
     * @param {{
     *  type: Symbol,
     *  top: Length|number,
     *  left: Length|number,
     *  right: Length|number,
     *  bottom: Length|number
     * }} param0 
     */
    setPositioning({ type, top, left, right, bottom }) {
        if (Positioning.contains(type)) {
            this.styles.position = positioningToCssValue(type)
        }

        if (isValidLength(left)) {
            this.styles.left = toLength(left)
        }

        if (isValidLength(right)) {
            this.styles.right = toLength(right)
        }

        if (isValidLength(top)) {
            this.styles.top = toLength(top)
        }

        if (isValidLength(bottom)) {
            this.styles.bottom = toLength(bottom)
        }

        return this
    }

    /**
     * @description A method to set the value for the CSS property of the View
     * @param {{
     *  property: string,
     *  value: string
     * }} param0 
     */
    setCSSProperty({ property, value }) {
        if (isString(property) && isString(value)) {
            this.styles[property] = value
        }

        return this
    }

    /**
     * @description A method to set the attribute for the View
     * @param {{
     *  name: string,
     *  value: string
     * }} param0 
     */
    setAttribute({ name, value }) {
        if (isString(name) && isString(value)) {
            this.attributes[name] = value
        }

        return this
    }
}

/**
 * @param {VNode} lastVNode 
 * @param {VNode} vNode 
 * @returns {Symbol}
 */
function updateComponentDOM (lastVNode, vNode) {
    if (lastVNode.tag !== vNode.tag || lastVNode.type === VNodeType.text || vNode.type === VNodeType.text) {
        lastVNode.dom.replaceWith(vNode.toHTMLNode({ save: true }))
        return
    }

    for (let i in lastVNode.styles) {
        if (!(i in vNode.styles)) {
            lastVNode.dom.style[i] = ""
        }
    }

    for (let i in vNode.styles) {
        if (!(i in lastVNode.styles && lastVNode.styles[i].toString() === vNode.styles[i].toString())) {
            lastVNode.dom.style[i] = vNode.styles[i]
        }
    }

    for (let i in lastVNode.events) {
        for (let handler of lastVNode.events[i]) {
            lastVNode.dom.removeEventListener(i, handler)
        }
    }

    for (let i in vNode.events) {
        for (let handler of lastVNode.events[i]) {
            if (typeof handler === "function") {
                lastVNode.dom.addEventListener(i, handler)
            }
        }
    }

    for (let i in lastVNode.attributes) {
        if (!(i in vNode.attributes)) {
            lastVNode.dom.removeAttribute(i)
        }
    }

    for (let i in vNode.attributes) {
        if (!(i in lastVNode.attributes && lastVNode.attributes[i].toString() === vNode.attributes[i].toString())) {
            lastVNode.dom.setAttribute(i, vNode.attributes[i])
        }
    }

    if (lastVNode.body.length !== vNode.body.length) {
        lastVNode.dom.innerHTML = ""
        
        for (let i in vNode.body) {
            vNode.body[i].mountTo(lastVNode.dom)
        }
    } else {
        for (let i in vNode.body) {
            updateComponentDOM(lastVNode.body[i], vNode.body[i])
            
            if (lastVNode.body[i].component instanceof View) {
                lastVNode.body[i].component.handleInvalidation()
            }
        }
    }

    vNode.dom = lastVNode.dom
}
