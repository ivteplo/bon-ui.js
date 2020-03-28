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
 * A class to respresent the UI item
 * @class
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
     * A method that returns the key->value object, which will be transformed into the state
     * @example
     * class Test extends View {
     *  getInitialState() {
     *      return {
     *          test: true
     *      }
     *  }
     * }
     * @returns {Object} Variables in the state and their default values
     */
    getInitialState () {
        return {}
    }

    /**
     * A method to restore the initial state
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
     * A method that returns the body (content) of the view
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
     * A method called after mounting
     */
    handleMount() {}

    /**
     * A method called after invalidation
     */
    handleInvalidation() {}

    /**
     * A method to mount the view
     * @param {Node} parent DOM object where to mount the view
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
     * A method to force reload the view
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
     * A method to force reload the view without scheduling
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
     * A method to set the ability to select the component's text/image to true or false
     * @param {Boolean} [value] 
     */
    setSelectableTo (value) {
        if (typeof value === "boolean" || value instanceof Boolean) {
            this.styles.userSelect = Boolean(value) ? "auto" : "none"
        }

        return this
    }

    /**
     * A method to set the foreground properties
     * @param {Object} options
     * @param {Color}  [options.color]  Color that will be set to the foreground
     */
    setForeground ({ color }) {
        if (color instanceof Color) {
            this.styles.color = color
        }

        return this
    }

    /**
     * A method to set the background properties
     * @param {Object} options
     * @param {COlor}  [options.color]  Color that will be set to the background
     */
    setBackground({ color }) {
        if (color instanceof Color) {
            this.styles.backgroundColor = color
        }

        return this
    }

    /**
     * A method to set the handler for the event
     * @param {Object}      options
     * @param {String}      [options.event]       Name of an event for which to add handler
     * @param {Function}    [options.handler]     Function that will be called after event happened
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
     * A method to set the font properties
     * @param {Font}    [font]  Font to set for the view
     */
    setFont (font) {
        if (font instanceof Font) {
            this.styles.font = font
        }

        return this
    }

    /**
     * A method to change the offset of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.all]       Offset for all sides
     * @param {Length|Number}   [options.top]       Offset for top side
     * @param {Length|Number}   [options.right]     Offset for right side
     * @param {Length|Number}   [options.bottom]    Offset for bottom side
     * @param {Length|Number}   [options.left]      Offset for left side
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
     * A method to change the padding of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.all]       Padding for all sides
     * @param {Length|Number}   [options.top]       Padding for top side
     * @param {Length|Number}   [options.right]     Padding for right side
     * @param {Length|Number}   [options.bottom]    Padding for bottom side
     * @param {Length|Number}   [options.left]      Padding for left side
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
     * A method to set the outline of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.all]       Size of outline
     * @param {Length|Number}   [options.top]       Top outline size
     * @param {Length|Number}   [options.right]     Right outline size
     * @param {Length|Number}   [options.bottom]    Bottom outline size
     * @param {Length|Number}   [options.left]      Left outline size
     * @param {Length|Number}   [options.radius]    Radius of outline
     * @param {Color}           [options.color]     Outline color
     * @param {Symbol}          [options.style]     Style of an outline. Item of OutlineStyle enum
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
     * A method to set the size of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.width]     Width of the view
     * @param {Length|Number}   [options.height]    Height of the view
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
     * A method to set the minimal size of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.width]     Minimal width of the view
     * @param {Length|Number}   [options.height]    Minimal height of the view
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
     * A method to set the maximal size of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.width]     Maximal width of the view
     * @param {Length|Number}   [options.height]    Maximal height of the view
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
     * A method to set the positioning of the View 
     * @param {Object}          options
     * @param {Length|Number}   [options.top]       Top position
     * @param {Length|Number}   [options.right]     Right position
     * @param {Length|Number}   [options.bottom]    Bottom position
     * @param {Length|Number}   [options.left]      Left position
     * @param {Symbol}          [options.type]      Type of positioning. Item of Positioning enum
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
     * A method to set the value for the CSS property of the View
     * @param {Object}          options
     * @param {Length|Number}   [options.property]      Property name
     * @param {Length|Number}   [options.value]         Property value
     */
    setCSSProperty({ property, value }) {
        if (isString(property) && isString(value)) {
            this.styles[property] = value
        }

        return this
    }

    /**
     * A method to set the attribute for the View
     * @param {Object}          options
     * @param {Length|Number}   [options.name]      Attribute name
     * @param {Length|Number}   [options.value]     Attribute value
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
        for (let j in vNode.events[i]) {
            lastVNode.dom.removeEventListener(i, lastVNode.events[i][j])
        }
    }

    for (let i in vNode.events) {
        for (let j in vNode.events[i]) {
            if (typeof vNode.events[i][j] === "function") {
                lastVNode.dom.addEventListener(i, vNode.events[i][j])
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
