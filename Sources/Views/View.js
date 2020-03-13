//
// View.js
// Created on 06/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { VNode, VNodeType, renderToVNode } from "../VirtualDOM/VNode"
import { Reconciler } from "../VirtualDOM/Reconciler"
import { ViewState } from "./ViewState"
import { Color } from "../Values/Color"
import { Enum } from "../Values/Enum"
import { Font } from "../Values/Font"
import { Length, Measure } from "../Values/Length"

// function updateComponentDOM is described after the class View

export const OutlineStyle = new Enum("solid", "dashed", "dotted", "groove", "hidden", "ridge", "none", "inherit")

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
            this.lastVNode = renderToVNode(this)
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
        if ((typeof event === "string" || event instanceof String) && typeof handler === "function") {
            this.events[event] = handler
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
        if (all instanceof Length || all instanceof Number || typeof all === "number") {
            this.styles.margin = all instanceof Length ? all : new Length(all, Measure.pixels)
        }

        if (top instanceof Length || top instanceof Number || typeof top === "number") {
            this.styles.marginTop = top instanceof Length ? top : new Length(top, Measure.pixels)
        }

        if (right instanceof Length || right instanceof Number || typeof right === "number") {
            this.styles.marginRight = right instanceof Length ? right : new Length(right, Measure.pixels)
        }

        if (bottom instanceof Length || bottom instanceof Number || typeof bottom === "number") {
            this.styles.marginBottom = bottom instanceof Length ? bottom : new Length(bottom, Measure.pixels)
        }

        if (left instanceof Length || left instanceof Number || typeof left === "number") {
            this.styles.marginLeft = left instanceof Length ? left : new Length(left, Measure.pixels)
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
        if (all instanceof Length || all instanceof Number || typeof all === "number") {
            this.styles.padding = all instanceof Length ? all : new Length(all, Measure.pixels)
        }

        if (top instanceof Length || top instanceof Number || typeof top === "number") {
            this.styles.paddingTop = top instanceof Length ? top : new Length(top, Measure.pixels)
        }

        if (right instanceof Length || right instanceof Number || typeof right === "number") {
            this.styles.paddingRight = right instanceof Length ? right : new Length(right, Measure.pixels)
        }

        if (bottom instanceof Length || bottom instanceof Number || typeof bottom === "number") {
            this.styles.paddingBottom = bottom instanceof Length ? bottom : new Length(bottom, Measure.pixels)
        }

        if (left instanceof Length || left instanceof Number || typeof left === "number") {
            this.styles.paddingLeft = left instanceof Length ? left : new Length(left, Measure.pixels)
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
        if (all instanceof Length || all instanceof Number || typeof all === "number") {
            this.styles.borderWidth = all instanceof Length ? all : new Length(all, Measure.pixels)
        }

        if (left instanceof Length || left instanceof Number || typeof left === "number") {
            this.styles.borderLeftWidth = left instanceof Length ? left : new Length(left, Measure.pixels)
        }

        if (right instanceof Length || right instanceof Number || typeof right === "number") {
            this.styles.borderRightWidth = right instanceof Length ? right : new Length(right, Measure.pixels)
        }

        if (top instanceof Length || top instanceof Number || typeof top === "number") {
            this.styles.borderTopWidth = top instanceof Length ? top : new Length(top, Measure.pixels)
        }

        if (bottom instanceof Length || bottom instanceof Number || typeof bottom === "number") {
            this.styles.borderBottomWidth = bottom instanceof Length ? bottom : new Length(bottom, Measure.pixels)
        }

        if (radius instanceof Length || radius instanceof Number || typeof radius === "number") {
            this.styles.borderRadius = radius instanceof Length ? radius : new Length(radius, Measure.pixels)
        } else if (Array.isArray(radius)) {
            this.styles.borderRadius = radius.map(item => {
                return item ? item.toString() : "0"
            }).join(" ")
        }

        if (color instanceof Color) {
            this.styles.borderColor = color
        }

        if (OutlineStyle.contains(style)) {
            this.styles.borderStyle = OutlineStyle.getIdentifier(style)
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
        if (width instanceof Length || width instanceof Number || typeof width === "number") {
            this.styles.width = width instanceof Length ? width : new Length(width, Measure.pixels)
        }

        if (height instanceof Length || height instanceof Number || typeof height === "number") {
            this.styles.height = height instanceof Length ? height : new Length(height, Measure.pixels)
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
        if (width instanceof Length || width instanceof Number || typeof width === "number") {
            this.styles.minWidth = width instanceof Length ? width : new Length(width, Measure.pixels)
        }

        if (height instanceof Length || height instanceof Number || typeof height === "number") {
            this.styles.minHeight = height instanceof Length ? height : new Length(height, Measure.pixels)
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
        if (width instanceof Length || width instanceof Number || typeof width === "number") {
            this.styles.maxWidth = width instanceof Length ? width : new Length(width, Measure.pixels)
        }

        if (height instanceof Length || height instanceof Number || typeof height === "number") {
            this.styles.maxHeight = height instanceof Length ? height : new Length(height, Measure.pixels)
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
        lastVNode.dom.removeEventListener(i, lastVNode.events[i])
    }

    for (let i in vNode.events) {
        lastVNode.dom.addEventListener(i, vNode.events[i])
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
