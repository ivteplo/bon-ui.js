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
import { VNode, VNodeType } from "../VirtualDOM/VNode"
import { Reconciler } from "../VirtualDOM/Reconciler"
import { Length, pixels } from "../Values/Length"
import { ViewState } from "./ViewState"
import { Color } from "../Values/Color"
import { Font } from "../Values/Font"
import { Worker } from "../Worker"

// function Reconciler.updateVNodeDOM is described after the class View

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
    /**
     * @param {Object} options Options for the View
     */
    constructor (options) {
        this.lastVNode = null
        this.mounted = false
        this.key = null
        this.styles = {}
        this.events = {}
        this.attributes = {}
        this.state = new ViewState()
        this.options = options || {}
        this.restoreState()
        
        Object.defineProperty(this, "mounted", {
            get: () => {
                return this.lastVNode instanceof VNode && this.lastVNode.dom instanceof Node
            },
            set: () => {}
        })
    }

    /**
     * A method to set a unique key to the view to make the reconcilation more fast and optimized
     * @prop {Number|String} key Key that will be set to the view
     */
    setKey(key) {
        if (typeof key === "number" || key instanceof Number) {
            this.key = Number(key)
        } else {
            this.key = key.toString()
        }

        return this
    }

    /**
     * A method that returns the key->value object, which will be transformed into the state
     * @example
     * class Test extends View {
     *     getInitialState() {
     *         return {
     *             test: true
     *         }
     *     }
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
        var { styles, attributes, events, key } = this

        return new VNode({
            key: key,
            tag: "div",
            styles: styles,
            events: events,
            attributes: attributes
        }, this)
    }

    /**
     * A method called after mounting
     */
    handleMount() {}

    /**
     * A method called after unmounting
     */
    handleUnmount() {}

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

        Worker.addUnitOfWork(() => {
            View.renderToVNode({ view: this, saveVNode: true })
            this.lastVNode.mountTo(parent)
            this.handleMount()
        })
    }

    /**
     * A method to force reload the view
     */
    invalidate () {
        if (this.mounted) {
            Worker.addUnitOfWork(() => {
                this.forceInvalidate()
            })
        }
    }

    /**
     * A method to force reload the view without scheduling
     */
    forceInvalidate () {
        if (this.mounted) {
            let vNode = View.renderToVNode({ view: this })
            Reconciler.updateVNodeDOM(this.lastVNode, vNode)
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

    /**
     * A method to convert the view to HTML string
     */
    toString() {
        var node = View.renderToVNode({ view: this, saveVNode: false, ignoreStateChange: true })
        return node.toString()
    }

    /**
     * A method to clone styles, attributes and events of one view to this
     */
    applyViewProperties(view) {
        if (view instanceof View) {
            this.styles = Object.assign(this.styles, typeof view.styles === "object" ? view.styles : {})
            this.attributes = Object.assign(this.styles, typeof view.styles === "object" ? view.attributes : {})

            for (let i in view.events) {
                this.setHandlerFor({ event: i, handler: view.events[i] })
            }

            if (view.key) {
                this.setKey(view.key)
            }
        }

        return this
    }

    /**
     * A method to clone mounting, invalidation and unmounting handlers of one view to this
     */
    applyViewHandlers(view) {
        if (view instanceof View) {
            this.handleMount = view.handleMount
            this.handleInvalidate = view.handleInvalidate
            this.handleUnmount = view.handleUnmount
        }

        return this
    }

    /**
     * A function to render view until body returns VNode
     * @param   {Object}     options
     * @param   {View|VNode} options.view                 View to render to VNode
     * @param   {Boolean}    [options.saveVNode]          If specified, the vNode will be saved to the `view.lastVNode`
     * @param   {Boolean}    [options.ignoreStateChange]  If specified, the state change will be ignored
     * @returns {VNode}      Result of recursive rendering of view to virtual node
     */
    static renderToVNode({ view, saveVNode = false, ignoreStateChange = false }) {
        let node

        if (view instanceof VNode) {
            node = view
        } else {
            node = view
            let components = []
            
            while (node instanceof View) {
                components.push(node)

                if (ignoreStateChange) {
                    let nodeClone = Object.create(node)
                    nodeClone.state.set = () => {}
                    node = nodeClone.getBody()
                } else {
                    node = node.getBody()
                }
            }

            if (node !== null) {
                if (!(node instanceof VNode)) {
                    throw new Error("Expected a VNode as the result of rendering the View (the rendering is recursive, so the error can be in the parent class or in the child class)")
                }

                node.component = components[components.length - 1]
                for (let i in node.body) {
                    if (node.body[i] instanceof View || node.body[i] instanceof VNode) {
                        node.body[i] = View.renderToVNode({ view: node.body[i], saveVNode: true, ignoreStateChange: ignoreStateChange })
                    } else {
                        throw new Error("Unexpected child passed")
                    }
                }
            }

            if (saveVNode) {
                for (let i = 0; i < components.length; ++i) {
                    components[i].lastVNode = node
                }
            }
        }

        return node
    }

}

