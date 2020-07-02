//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

// importing modifiers
import { ForegroundColorModifier } from "../ViewModifiers/ForegroundColorModifier.js"
import { EventHandlerModifier } from "../ViewModifiers/EventHandlerModifier.js"
import { ViewVNodeModifier } from "../ViewModifiers/ViewVNodeModifier.js"
import { PositionModifier } from "../ViewModifiers/PositionModifier.js"
import { PaddingModifier } from "../ViewModifiers/PaddingModifier.js"
import { ZIndexModifier } from "../ViewModifiers/ZIndexModifier.js"
import { OffsetModifier } from "../ViewModifiers/OffsetModifier.js"
import { FontModifier } from "../ViewModifiers/FontModifier.js"
import { ViewModifier } from "../ViewModifiers/ViewModifier.js"
import { SizeModifier } from "../ViewModifiers/SizeModifier.js"
import { CSSModifier } from "../ViewModifiers/CSSModifier.js"

import { ViewController } from "../Application/ViewController.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { ClickInfo } from "../Values/ClickInfo.js"
import { Protocol } from "../Values/Protocol.js"
import { getClass } from "../Values/Helpers.js"
import { Length } from "../Values/Length.js"
import { State } from "../Values/State.js"
import { Color } from "../Values/Color.js"
import { Worker } from "../Worker.js"

const ViewProtocol = Protocol.createClass({
    requiredMethods: [ "body" ]
})

/**
 * @callback ClickHandler
 * @param {ClickInfo}   clickInfo   information about click
 * @param {View}        view        view
 */

/**
 * @callback ViewLifecycleHandler
 * @param {View} view view for which the handler was added
 */

/**
 * Class that respresents UI item
 * @interface
 */
export class View extends ViewProtocol {
    constructor () {
        super()

        /**
         * @type {string|null}
         * Identifier of the view
         */
        this.id = null

        /**
         * @private
         * Virtual DOM node modifiers
         */
        this._vNodeModifiers = []

        /**
         * @type {ViewController}
         */
        this.controller = new ViewController(this)

        /**
         * @type {State}
         */
        this.state = new State((state = this.initialState(), action) => {
            switch (action.type) {
                case "set":
                    return Object.assign(state, action.value)
                default:
                    return state
            }
        })

        this.state.subscribe(this.update.bind(this))

        this.state.set = (keys) => {
            this.state.dispatch({ type: "set", value: keys })
        }

        /**
         * @type {View}
         */
        this._navigationBarTitle = null
    }

    /**
     * Method to update the view
     */
    update () {
        Worker.addUnitOfWork(() => {
            this.controller.updateView()
        })
    }

    /**
     * Method that returns the "key: value" object, which will be transformed into the state
     * @returns {Object} Variables in the state and their default values
     */
    initialState () {
        return {}
    }

    /**
     * Method to set identifier for the view (helps in rendering)
     * @param {string|null} id identifier
     */
    setID (id) {
        if (!(typeof id === "string" || id === null)) {
            throw new InvalidValueException(`Expected string identifier or null, got ${typeof id}`)
        }

        this.id = id
        return this
    }

    /**
     * Method to add a handler for "view will appear" event
     * @param {ViewLifecycleHandler} handler method that will be called
     */
    onWillAppear (handler) {
        this.controller.addOnViewWillAppearHandler(handler)
        return this
    }

    /**
     * Method to add a handler for "view appeared" event
     * @param {ViewLifecycleHandler} handler method that will be called
     */
    onDidAppear (handler) {
        this.controller.addOnViewDidAppearHandler(handler)
        return this
    }

    /**
     * Method to add a handler for "view will update" event
     * @param {ViewLifecycleHandler} handler method that will be called
     */
    onWillUpdate (handler) {
        this.controller.addOnViewWillUpdateHandler(handler)
        return this
    }

    /**
     * Method to add a handler for "view updated" event
     * @param {ViewLifecycleHandler} handler method that will be called
     */
    onDidUpdate (handler) {
        this.controller.addOnViewDidUpdateHandler(handler)
        return this
    }

    /**
     * Method to add a handler for "view will disappear" event
     * @param {ViewLifecycleHandler} handler method that will be called
     */
    onWillDisappear (handler) {
        this.controller.addOnViewWillDisappearHandler(handler)
        return this
    }

    /**
     * Method to add a handler for "view disappeared" event
     * @param {ViewLifecycleHandler} handler method that will be called
     */
    onDidDisappear (handler) {
        this.controller.addOnViewDidDisappearHandler(handler)
        return this
    }

    // Navigation methods

    /**
     * Method to set the navigation bar title
     * @param {View} title title to show in navigation bar
     */
    navigationBarTitle (title) {
        if (!(title instanceof View)) {
            throw new InvalidValueException(`Unexpected title passed. Expected navigation bar title to be an instance of View, got ${getClass(title)}`)
        }

        this._navigationBarTitle = title
        return this
    }

    // View modifiers section

    /**
     * Method to add view modifier
     * @param {ViewModifier} modifier 
     */
    modifier (modifier) {
        if (!(modifier instanceof ViewModifier)) {
            throw new InvalidValueException(`Unexpected modifier passed (expected ViewModifier instance, got ${modifier.constructor.name})`)
        }

        if (modifier instanceof ViewVNodeModifier) {
            this._vNodeModifiers.push(modifier)
            return this
        }

        return modifier.body(this)
    }

    /**
     * Method to set foreground color
     * @param {Color} color color to set as the foreground color
     */
    foregroundColor (color) {
        return this.modifier(new ForegroundColorModifier(color))
    }

    /**
     * Method to set padding
     * @param {Length|number}   padding padding value
     * @param {Symbol}          edge    item of Edge enum
     */
    padding (padding, edge) {
        return this.modifier(new PaddingModifier(padding, edge))
    }

    /**
     * Method to set handler for "click" event
     * @param {ClickHandler} handler function that is called when user clicks
     */
    onClick (handler) {
        return this.modifier(new EventHandlerModifier("click", event => handler(ClickInfo.fromMouseEvent(event), this)))
    }

    /**
     * Method to set font for the view
     * @param {Font} font font to use
     */
    font (font) {
        return this.modifier(new FontModifier(font))
    }

    /**
     * Method to set size of the view
     * @param {Object}          options
     * @param {Length|number}   [options.width]     width to set
     * @param {Length|number}   [options.height]    height to set
     */
    size ({ width, height }) {
        return this.modifier(new SizeModifier({ width, height }))
    }

    /**
     * Method to set minimum size of the view
     * @param {Object}          options
     * @param {Length|number}   [options.width]     width to set
     * @param {Length|number}   [options.height]    height to set
     */
    minSize ({ width, height }) {
        return this.modifier(new SizeModifier({ width, height, prefix: "min" }))
    }

    /**
     * Method to set maximum size of the view
     * @param {Object}          options
     * @param {Length|number}   [options.width]     width to set
     * @param {Length|number}   [options.height]    height to set
     */
    maxSize ({ width, height }) {
        return this.modifier(new SizeModifier({ width, height, prefix: "max" }))
    }

    /**
     * Method to set index of layer on the Z axis
     * @param {number} value index
     */
    zIndex (value) {
        return this.modifier(new ZIndexModifier(value))
    }

    /**
     * Method to set position of the view
     * @param {Symbol} position item of `Position` enum
     */
    position (position) {
        return this.modifier(new PositionModifier(position))
    }

    /**
     * Method to set offset of the view
     * @param {*} options
     * @param {Length|number} [options.x] x offset
     * @param {Length|number} [options.y] y offset
     */
    offset ({ x, y } = {}) {
        return this.modifier(new OffsetModifier({ x, y }))
    }

    /**
     * Method to make text in the view written in upper case
     */
    upperCase () {
        return this.modifier(new CSSModifier({ textTransform: "uppercase" }))
    }

    /**
     * Method to set background of the view
     * @param {View|Color} background background of the view
     */
    // implemented in /Sources/BonUI/BonUI.js
    // because of circular dependency
    background (background) {}
}
