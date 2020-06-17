//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { WhiteSpaceStyle, whiteSpaceStyleToCssValue } from "../Values/WhiteSpaceStyle.js"
import { OutlineStyle, outlineStyleToCssValue } from "../Values/OutlineStyle.js"
import { Positioning, positioningToCssValue } from "../Values/Positioning.js"
import { VNode, VNodeType } from "../VirtualDOM/VNode.js"
import { Reconciler } from "../VirtualDOM/Reconciler.js"
import { Length, pixels } from "../Values/Length.js"
import { flattenArray } from "../Values/Array.js"
import { State } from "../Values/State.js"
import { Event } from "../Values/Event.js"
import { Color } from "../Values/Color.js"
import { Font } from "../Values/Font.js"
import { Worker } from "../Worker.js"

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
        this.options = options || {}
        this.key = null

        this._styles = {}
        this._handlers = {}
        this._attributes = {}
        this._prefersForceInvalidation = false

        this.state = new State((state = this.initialState(), action) => {
            switch (action.type) {
                case "set":
                    return Object.assign(state, action.value)
                default:
                    return state
            }
        })

        this.state.subscribe(() => {
            if (this._prefersForceInvalidation) {
                this.forceInvalidate()
            } else {
                this.invalidate()
            }
        })

        this.state.set = (keys) => {
            this.state.dispatch({ type: "set", value: keys })
        }

        this.state.get = (key) => {
            return this.state._currentState[key]
        }

        this.applyCSS({ boxSizing: "border-box" })
        this.initialize()
    }

    get dom () {
        return this.isMounted ? this.lastVNode.dom : null
    }

    get isMounted () {
        return this.lastVNode instanceof VNode && this.lastVNode.dom instanceof Node
    }

    /**
     * Function that is called after the constructor
     */
    initialize () {}

    /**
     * Method to set the prefered invalidation mode to force (when state is changed, view will update without scheduling)
     */
    preferForceInvalidation () {
        this._prefersForceInvalidation = true
        return this
    }

    /**
     * Method to set the prefered invalidation mode to scheduled (when state is changed, view will update with scheduling)
     */
    preferScheduledInvalidation () {
        this._prefersForceInvalidation = false
        return this
    }

    /**
     * A method to set a unique key to the view to make the reconcilation more fast and optimized
     * @prop {Number|String} key Key that will be set to the view
     * @example
     * import posts from "./Posts"
     * export class Posts extends View {
     *    body() {
     *         return (
     *             new VStack(
     *                 posts.map(post => (
     *                     new Text(post.title)
     *                         .setKey(post.id)
     *                 ))
     *             )
     *         )
     *     }
     * }
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
     *     initialState() {
     *         return {
     *             test: true
     *         }
     *     }
     * }
     * @returns {Object} Variables in the state and their default values
     */
    initialState () {
        return {}
    }

    /**
     * A method that returns the body (content) of the view
     * @param {String} [side] Side of the rendering (`"server"`, `"client"` etc.)
     */
    body (side = "client") {
        var { _styles: styles, _attributes: attributes, _handlers: handlers, key } = this

        return new VNode({
            key: key,
            tag: "div",
            styles: styles,
            handlers: handlers,
            attributes: attributes
        }, this)
    }

    /**
     * A method called after mounting
     */
    handleMounting() {
        if (this._handlers.mounting) {
            this._handlers.mounting.forEach(handler => {
                handler(new Event("mounting", {
                    view: this,
                    dom: this.dom
                }), this)
            })
        }
    }

    /**
     * A method called before unmounting
     */
    handleUnmounting() {
        if (this._handlers.unmounting) {
            this._handlers.unmounting.forEach(handler => {
                handler(new Event("unmounting", {
                    view: this,
                    dom: this.dom
                }), this)
            })
        }
    }

    /**
     * A method called after invalidation
     */
    handleInvalidation() {
        if (this._handlers.invalidation) {
            this._handlers.invalidation.forEach(handler => {
                handler(new Event("invalidation", {
                    view: this,
                    dom: this.dom
                }), this)
            })
        }
    }

    /**
     * A method called after invalidation
     */
    handleHydration() {
        if (this._handlers.hydration) {
            this._handlers.hydration.forEach(handler => {
                handler(new Event("hydration", {
                    view: this,
                    dom: this.dom
                }), this)
            })
        }
    }

    /**
     * A method to mount the view
     * @param {Node} parent DOM object where to mount the view
     */
    mountTo (parent = document.body) {
        if (this.isMounted) {
            throw new Error("The view is already mounted")
        }

        if (!(parent instanceof Node)) {
            throw new Error("The parent is not an instance of Node")
        }

        Worker.addUnitOfWork(() => {
            View.renderToVNode({ view: this, saveVNode: true })
            this.lastVNode.mountTo(parent)
            this.handleMounting()
        })
    }

    /**
     * A method to unmount the view
     */
    unmount () {
        if (!this.isMounted) {
            throw new Error("The view is not mounted")
        }

        Worker.addUnitOfWork(() => {
            this.lastVNode.unmount()
        })
    }

    /**
     * A method to force reload the view
     */
    invalidate () {
        if (this.isMounted) {
            Worker.addUnitOfWork(() => {
                this.forceInvalidate()
            })
        }
    }

    /**
     * A method to force reload the view without scheduling
     */
    forceInvalidate () {
        if (this.isMounted) {
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
    selectable (value = true) {
        if (typeof value === "boolean" || value instanceof Boolean) {
            this._styles.userSelect = Boolean(value) ? "auto" : "none"
        }

        return this
    }

    /**
     * A method to set the foreground properties
     * @param {Object} options
     * @param {Color}  [options.color]  Color that will be set to the foreground
     */
    foreground ({ color }) {
        if (color instanceof Color) {
            this._styles.color = color
        }

        return this
    }

    /**
     * A method to set the background properties
     * @param {Object} options
     * @param {COlor}  [options.color]  Color that will be set to the background
     */
    background({ color }) {
        if (color instanceof Color) {
            this._styles.backgroundColor = color
        }

        return this
    }

    /**
     * A method to set the handler for the event
     * @param {String|String[]} event       Name of an event for which to add handler or array of event names
     * @param {Function}        handler     Function that will be called after event happened
     */
    handle (event, handler) {
        if (typeof handler === "function") {
            if (isString(event)) {
                if (!(event in this._handlers)) {
                    this._handlers[event] = []
                }

                this._handlers[event].push((event) => {
                    handler(event, this)
                })
            } else if (Array.isArray(event)) {
                event.forEach(eventName => {
                    this.handle(eventName, handler)
                })
            }
        }

        return this
    }

    /**
     * A method to set the font properties
     * @param {Font}    [font]  Font to set for the view
     */
    font (font) {
        if (font instanceof Font) {
            this._styles.font = font
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
    offset ({ all, top, right, bottom, left }) {
        if (isValidLength(all)) {
            this._styles.margin = toLength(all)
        }

        if (isValidLength(top)) {
            this._styles.marginTop = toLength(top)
        }

        if (isValidLength(right)) {
            this._styles.marginRight = toLength(right)
        }

        if (isValidLength(bottom)) {
            this._styles.marginBottom = toLength(bottom)
        }

        if (isValidLength(left)) {
            this._styles.marginLeft = toLength(left)
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
    padding ({ all, top, right, bottom, left }) {
        if (isValidLength(all)) {
            this._styles.padding = toLength(all)
        }

        if (isValidLength(top)) {
            this._styles.paddingTop = toLength(top)
        }

        if (isValidLength(right)) {
            this._styles.paddingRight = toLength(right)
        }

        if (isValidLength(bottom)) {
            this._styles.paddingBottom = toLength(bottom)
        }

        if (isValidLength(left)) {
            this._styles.paddingLeft = toLength(left)
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
    outline ({ left, top, right, bottom, all, color, style, radius }) {
        if (isValidLength(all)) {
            this._styles.borderWidth = toLength(all)
        }

        if (isValidLength(left)) {
            this._styles.borderLeftWidth = toLength(left)
        }

        if (isValidLength(right)) {
            this._styles.borderRightWidth = toLength(right)
        }

        if (isValidLength(top)) {
            this._styles.borderTopWidth = toLength(top)
        }

        if (isValidLength(bottom)) {
            this._styles.borderBottomWidth = toLength(bottom)
        }

        if (isValidLength(radius)) {
            this._styles.borderRadius = toLength(radius)
        } else if (Array.isArray(radius)) {
            this._styles.borderRadius = radius.map(item => {
                return toLength(item)
            }).join(" ")
        }

        if (color instanceof Color) {
            this._styles.borderColor = color
        }

        if (OutlineStyle.contains(style)) {
            this._styles.borderStyle = outlineStyleToCssValue(style)
        }

        return this
    }

    /**
     * A method to set the size of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.width]     Width of the view
     * @param {Length|Number}   [options.height]    Height of the view
     */
    size({ width, height }) {
        if (isValidLength(width)) {
            this._styles.width = toLength(width)
        }

        if (isValidLength(height)) {
            this._styles.height = toLength(height)
        }

        return this
    }

    /**
     * A method to set the minimal size of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.width]     Minimal width of the view
     * @param {Length|Number}   [options.height]    Minimal height of the view
     */
    minSize({ width, height }) {
        if (isValidLength(width)) {
            this._styles.minWidth = toLength(width)
        }

        if (isValidLength(height)) {
            this._styles.minHeight = toLength(height)
        }

        return this
    }

    /**
     * A method to set the maximal size of the view
     * @param {Object}          options
     * @param {Length|Number}   [options.width]     Maximal width of the view
     * @param {Length|Number}   [options.height]    Maximal height of the view
     */
    maxSize({ width, height }) {
        if (isValidLength(width)) {
            this._styles.maxWidth = toLength(width)
        }

        if (isValidLength(height)) {
            this._styles.maxHeight = toLength(height)
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
    positioning({ type, top, left, right, bottom }) {
        if (Positioning.contains(type)) {
            this._styles.position = positioningToCssValue(type)
        }

        if (isValidLength(left)) {
            this._styles.left = toLength(left)
        }

        if (isValidLength(right)) {
            this._styles.right = toLength(right)
        }

        if (isValidLength(top)) {
            this._styles.top = toLength(top)
        }

        if (isValidLength(bottom)) {
            this._styles.bottom = toLength(bottom)
        }

        return this
    }

    /**
     * A method to apply CSS styles to the view
     * @param {Object} properties Object with CSS properties and their values
     */
    applyCSS (properties) {
        for (let property in properties) {
            if (isString(property) && isString(properties[property])) {
                this._styles[property] = properties[property]
            }
        }

        return this
    }

    /**
     * A method to set the attributes for the View
     * @param {Object} attributes Object with HTML attributes and their values
     */
    setAttributes (attributes) {
        for (let name in attributes) {
            if (isString(name) && isString(attributes[name])) {
                this._attributes[name] = attributes[name]
            }
        }

        return this
    }

    /**
     * A method to convert the view to HTML string
     */
    toString(side = "server") {
        var node = View.renderToVNode({ view: this, saveVNode: false, ignoreStateChange: true, side: side })
        return node.toString()
    }

    /**
     * A method to clone styles, attributes and events of one view to this
     */
    cloneViewProperties(view) {
        if (view instanceof View) {
            this._styles = Object.assign(this._styles, typeof view._styles === "object" ? view._styles : {})
            this._attributes = Object.assign(this._attributes, typeof view._attributes === "object" ? view._attributes : {})

            for (let i in view._handlers) {
                for (let j in view._handlers[i]) {
                    this.handle(i, view._handlers[i][j])
                }
            }

            if (view.key) {
                this.setKey(view.key)
            }
        }

        return this
    }

    /**
     * A method to clone mounting, invalidation, unmounting and hydration handlers of one view to this
     */
    cloneViewHandlers(view) {
        if (view instanceof View) {
            this.handleMounting = view.handleMounting.bind(this)
            this.handleInvalidation = view.handleInvalidation.bind(this)
            this.handleUnmounting = view.handleUnmounting.bind(this)
            this.handleHydration = view.handleHydration.bind(this)
        }

        return this
    }

    /**
     * A method to make "alive" the DOM, generated using the server side rendering
     * @param {Node} dom DOM node, generated using the server side rendering
     */
    hydrate(dom) {
        const node = View.renderToVNode({ view: this, saveVNode: true })
        node.hydrate(dom)
        this.handleHydration()
    }

    /**
     * A function to render view until body returns VNode
     * @param   {Object}     options
     * @param   {View|VNode} options.view                 View to render to VNode
     * @param   {Boolean}    [options.saveVNode]          If specified, the vNode will be saved to the `view.lastVNode`
     * @param   {Boolean}    [options.ignoreStateChange]  If specified, the state change will be ignored
     * @param   {String}     [options.side]               Side of the rendering (`"server"`, `"client"` etc.)
     * @returns {VNode}      Result of recursive rendering of view to virtual node
     */
    static renderToVNode({ view, saveVNode = false, ignoreStateChange = false, side = "client" }) {
        var node

        if (view instanceof VNode) {
            node = view
        } else {
            node = view
            var views = []
            
            while (node instanceof View) {
                views.push(node)

                if (ignoreStateChange) {
                    const nodeStateSet = node.state.set
                    node.state.set = () => {}
                    
                    let newNode = node.body(side)
                    node.state.set = nodeStateSet
                    node = newNode
                } else {
                    node = node.body(side)
                }
            }

            if (node != null) {
                if (!(node instanceof VNode)) {
                    throw new Error("Expected a VNode as the result of rendering the View (the rendering is recursive, so the error can be in the parent class or in the child class)")
                }

                node.view = views[views.length - 1]
            }
        }

        if (node.body) {
            var bodyResult = []
            node.body = flattenArray(node.body)

            for (let i in node.body) {
                if (node.body[i] instanceof View || node.body[i] instanceof VNode) {
                    bodyResult.push(View.renderToVNode({ 
                        ignoreStateChange: ignoreStateChange, 
                        view: node.body[i], 
                        saveVNode: true, 
                        side: side, 
                    }))

                    const lastItem = bodyResult.length - 1

                    if (Array.isArray(bodyResult[lastItem])) {
                        const items = bodyResult[lastItem]
                        bodyResult.splice(i, 1, ...items)
                    }
                } else {
                    throw new Error("Unexpected child passed")
                }
            }

            node.body = bodyResult
        }

        if (view instanceof View && saveVNode) {
            for (let i = 0; i < views.length; ++i) {
                views[i].lastVNode = node
            }
        }

        return node
    }

    /**
     * Method to set up the whitespace of the view
     * @param {Object} options
     * @param {Symbol} [options.style] whitespace showing style. Item of `WhiteSpaceStyle` enum
     */
    whiteSpace ({ style } = {}) {
        if (WhiteSpaceStyle.contains(style)) {
            this._styles.whiteSpace = whiteSpaceStyleToCssValue(style)
        }

        return this
    }

    // DEPRECATED METHODS
    // they are still here to make the old apps be able to work for some time before they migrate
    /**
     * @deprecated
     */
    setPositioning(...args) {
        console.warn("Method `setPositioning` is deprecated. Please, start using new method `positioning`.")
        return this.positioning(...args)
    }

    /**
     * @deprecated
     */
    getBody(...args) {
        console.warn("Method `getBody` is deprecated. Please, start using new method `body`.")
        return this.body(...args)
    }

    /**
     * @deprecated
     */
    getInitialState(...args) {
        console.warn("Method `getInitialState` is deprecated. Please, start using new method `initialState`.")
        return this.initialState(...args)
    }

    /**
     * @deprecated
     */
    setSize(...args) {
        console.warn("Method `setSize` is deprecated. Please, start using new method `size`.")
        return this.size(...args)
    }

    /**
     * @deprecated
     */
    setMaxSize(...args) {
        console.warn("Method `setMaxSize` is deprecated. Please, start using new method `maxSize`.")
        return this.maxSize(...args)
    }

    /**
     * @deprecated
     */
    setMinSize(...args) {
        console.warn("Method `setMinSize` is deprecated. Please, start using new method `minSize`.")
        return this.minSize(...args)
    }

    /**
     * @deprecated
     */
    setOutline(...args) {
        console.warn("Method `setOutline` is deprecated. Please, start using new method `outline`.")
        return this.outline(...args)
    }

    /**
     * @deprecated
     */
    setOffset(...args) {
        console.warn("Method `setOffset` is deprecated. Please, start using new method `offset`.")
        return this.offset(...args)
    }

    /**
     * @deprecated
     */
    setPadding(...args) {
        console.warn("Method `setPadding` is deprecated. Please, start using new method `padding`.")
        return this.padding(...args)
    }

    /**
     * @deprecated
     */
    setMinSize(...args) {
        console.warn("Method `setMinSize` is deprecated. Please, start using new method `minSize`.")
        return this.size(...args)
    }

    /**
     * @deprecated
     */
    setBackground(...args) {
        console.warn("Method `setBackground` is deprecated. Please, start using new method `background`.")
        return this.background(...args)
    }

    /**
     * @deprecated
     */
    setFont(...args) {
        console.warn("Method `setFont` is deprecated. Please, start using new method `font`.")
        return this.font(...args)
    }

    /**
     * @deprecated
     */
    setForeground(...args) {
        console.warn("Method `setForeground` is deprecated. Please, start using new method `foreground`.")
        return this.foreground(...args)
    }

    /**
     * @deprecated
     */
    setMinSize(...args) {
        console.warn("Method `setMinSize` is deprecated. Please, start using new method `minSize`.")
        return this.size(...args)
    }

    /**
     * @deprecated
     */
    setSelectableTo(...args) {
        console.warn("Method `setSelectableTo` is deprecated. Please, start using new method `selectable`.")
        return this.selectable(...args)
    }

    /**
     * @deprecated
     */
    setWhiteSpaceStyle(style) {
        console.warn("Method `setWhiteSpaceStyle` is deprecated. Please, start using new method `whiteSpace`.")
        return this.whiteSpace({ style })
    }

    /**
     * @deprecated
     */
    whiteSpaceStyle(style) {
        console.warn("Method `whiteSpaceStyle` is deprecated. Please, start using new method `whiteSpace`.")
        return this.whiteSpace({ style })
    }
}

/**
 * Function to create a view class
 * @param {Object}              options
 * @param {Function}            [options.body]                  function that returns the view/virtual node that represents the view
 * @param {Function}            [options.initialize]            function that is called after the constructor
 * @param {Function|Object}     [options.initialState]          function that returns the initial state
 * @param {Function}            [options.handleMounting]        function that is called when the view was mounted
 * @param {Function}            [options.handleUnmounting]      function that is called when the view was unmounted
 * @param {Function}            [options.handleInvalidation]    function that is called when the view was invalidated
 * @param {Function}            [options.handleHydration]       function that is called when the view was hydrated
 */
export function createViewClass(options) {
    const viewClass = class extends View {}
    if (options.body instanceof Function) {
        viewClass.prototype.body = options.body
    }

    if (options.initialize instanceof Function) {
        viewClass.prototype.initialize = options.initialize
    }

    if (options.initialState instanceof Function) {
        viewClass.prototype.initialState = options.initialState
    } else if (typeof options.initialState === "object") {
        viewClass.prototype.initialState = function () {
            return options.initialState
        }
    }

    if (options.handleMounting instanceof Function) {
        viewClass.prototype.handleMounting = options.handleMounting
    }

    if (options.handleUnmounting instanceof Function) {
        viewClass.prototype.handleUnmounting = options.handleUnmounting
    }

    if (options.handleInvalidation instanceof Function) {
        viewClass.prototype.handleInvalidation = options.handleInvalidation
    }

    if (options.handleHydration instanceof Function) {
        viewClass.prototype.handleHydration = options.handleHydration
    }

    return viewClass
}

