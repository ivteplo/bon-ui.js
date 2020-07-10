//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException, ViewControllerException } from "../Values/Exceptions.js"
import { ViewBuilder } from "../Views/ViewBuilder.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { getClass } from "../Values/Helpers.js"
import { View } from "./View.js"

/**
 * Class that is used to control view 
 */
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
        this.vNode = null

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
            this.vNode = this.view.controller.vNode
            this.view.controller.view = null
            this.view.controller = null
        }

        this.view.controller = this
    }

    /**
     * Method that is called by View before it will start to destruct
     */
    viewWillDestruct () {
        this.view.controller = null
        this.view = null
        this.vNode = null
    }

    /**
     * Method to update the view
     */
    updateView () {
        // something calls this method even after the view was unmounted
        /** @todo fix the error of unmounting */
        if (!(this.vNode && this.vNode.built)) {
            return
        }

        const { vNode } = this

        if (!(vNode instanceof VNode)) {
            throw new ViewControllerException(`View ${this.view.constructor.name} is not mounted`)
        }

        this.viewWillUpdate()

        ViewBuilder.build(this.view, { save: true })
        const renderer = vNode.renderer
        renderer.update(this.vNode, vNode, vNode.built)

        this.viewDidUpdate()
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
        this.vNode = null

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
