//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException, ViewControllerException } from "../Values/Exceptions.js"
import { getClass } from "../Values/Helpers.js"
import { ViewBuilder } from "./ViewBuilder.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { View } from "../Views/View.js"

export class ViewController {
    /**
     * 
     * @param {View} view view to control
     */
    constructor (view) {
        if (!(view instanceof View)) {
            throw new InvalidValueException(`Expected view, got ${getClass(view)}`)
        }

        this.view = view
        /**
         * @type {VNode}
         */
        this.lastViewRender = null

        this.viewHandlers = {
            willAppear: [],
            didAppear: [],
            willUpdate: [],
            didUpdate: [],
            willDisappear: [],
            didDisappear: []
        }

        if (this.view.controller instanceof ViewController) {
            this.viewHandlers = this.view.controller.viewHandlers
            this.lastViewRender = this.view.controller.lastViewRender
        }

        this.view.controller = this
    }

    /**
     * Method to load the view into the real DOM node
     * @param {*}    [options]
     * @param {Node} [options.to] parent node 
     */
    loadView ({ to: parent = document.body } = {}) {
        if (this.lastViewRender instanceof VNode) {
            throw new ViewControllerException(`View ${this.view.constructor.name} is already mounted`)
        }

        this.buildView()
        this.lastViewRender.toDomNode({ save: true })
        parent.appendChild(this.lastViewRender.dom)
    }

    /**
     * Method to build the view with options passed
     * @param {*} options ViewBuilder options. See {@link ViewBuilder}
     */
    buildView (options = {}) {
        ViewBuilder.build(this.view, options)
    }

    /**
     * Method to update the view
     */
    updateView () {
        if (!(this.lastViewRender instanceof VNode)) {
            throw new ViewControllerException(`View ${this.view.constructor.name} is not mounted`)
        }

        const { lastViewRender } = this
        this.buildView({ action: "update" })
        this.lastViewRender.updateDomNode(lastViewRender, lastViewRender.dom)
    }

    viewWillAppear () {
        for (let handler of this.viewHandlers.willAppear) {
            handler(this.view)
        }
    }

    viewDidAppear () {
        for (let handler of this.viewHandlers.didAppear) {
            handler(this.view)
        }
    }

    viewWillUpdate () {
        for (let handler of this.viewHandlers.willUpdate) {
            handler(this.view)
        }
    }

    viewDidUpdate () {
        for (let handler of this.viewHandlers.didUpdate) {
            handler(this.view)
        }
    }

    viewWillDisappear () {
        for (let handler of this.viewHandlers.willDisappear) {
            handler(this.view)
        }
    }

    viewDidDisappear () {
        for (let handler of this.viewHandlers.didDisappear) {
            handler(this.view)
        }
    }

    addOnViewWillAppearHandler (handler) {
        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${getClass(handler)}`)
        }

        this.viewHandlers.willAppear.push(handler)
    }

    addOnViewDidAppearHandler (handler) {
        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${getClass(handler)}`)
        }

        this.viewHandlers.didAppear.push(handler)
    }

    addOnViewWillUpdateHandler (handler) {
        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${getClass(handler)}`)
        }

        this.viewHandlers.willUpdate.push(handler)
    }

    addOnViewDidUpdateHandler (handler) {
        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${getClass(handler)}`)
        }

        this.viewHandlers.didUpdate.push(handler)
    }

    addOnViewWillDisappearHandler (handler) {
        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${getClass(handler)}`)
        }

        this.viewHandlers.willDisappear.push(handler)
    }

    addOnViewDidDisappearHandler (handler) {
        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${getClass(handler)}`)
        }

        this.viewHandlers.didDisappear.push(handler)
    }
}
