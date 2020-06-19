//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { PaddingModifier } from "../ViewModifiers/PaddingModifier.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { FontModifier } from "../ViewModifiers/FontModifier.js"
import { ViewModifier } from "../ViewModifiers/ViewModifier.js"
import { flattenArray } from "../Values/Array.js"
import { Protocol } from "../Values/Protocol.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { pixels } from "../Values/Length.js"
import { State } from "../Values/State.js"
import { Edge } from "../Values/Edge.js"
import { Worker } from "../Worker.js"
import { Font } from "../Values/Font.js"

const ViewProtocol = Protocol.createClass({
    requiredMethods: [ "body" ]
})

/**
 * A class to respresent the UI item
 */
export class View extends ViewProtocol {
    constructor () {
        super()
        this.lastRender = null
        this.modifiers = []

        this.state = new State((state = this.initialState(), action) => {
            switch (action.type) {
                case "set":
                    return Object.assign(state, action.value)
                default:
                    return state
            }
        })

        this.state.subscribe(() => {
            if (this.lastRender && this.lastRender.dom) {
                this.invalidate({
                    useIdleCallback: true
                })
            }
        })

        this.state.set = (keys) => {
            this.state.dispatch({ type: "set", value: keys })
        }
    }

    /**
     * Method that returns the "key: value" object, which will be transformed into the state
     * @returns {Object} Variables in the state and their default values
     */
    initialState () {
        return {}
    }

    /**
     * Method to invalidate (update) the view
     * @param {*}       [options] 
     * @param {Boolean} [options.useIdleCallback] if true then invalidation will be called when the browser is not busy
     */
    invalidate ({ useIdleCallback = false } = {}) {
        const invalidate = () => {
            if (this.lastRender === null) {
                return
            }

            const render = View.renderToVirtualDomNode(this)
            render.updateDomNode(this.lastRender, this.lastRender.dom)
            this.lastRender = render
        }
        
        if (useIdleCallback) {
            Worker.addUnitOfWork(invalidate)
        } else {
            invalidate()
        }
    }

    /**
     * Method to render the view until it becomes virtual DOM node
     * @param {View}    view            view to render to virtual DOM node
     * @param {*}       options         optional
     * @param {Boolean} [options.save]  save the value to the view.lastRender or node
     */
    static renderToVirtualDomNode (view, { save = false } = {}) {
        var result = view
        var views = []

        // don't use `_view` as the latest view rendering result
        // because it's used for loop and becomes 
        var _view = view

        while (result instanceof View) {
            views.push(_view)
            result = result.body()
            
            // applying modifiers
            if ("modifiers" in _view && Array.isArray(_view.modifiers)) {
                for (let modifier of _view.modifiers) {
                    result = modifier.body(result)
                }
            }
            
            _view = result
        }

        if (!(result instanceof VNode)) {
            throw new InvalidValueException(`Expected virtual DOM node as the result of rendering. Perhaps error is in ${views[views.length - 1].constructor.name} class`)
        }

        if (result.body instanceof Function) {
            result.body = result.body()
        }

        if (!Array.isArray(result.body)) {
            result.body = [ result.body ]
        }

        result.body = flattenArray(result.body).filter(v => v != null)

        for (let child in result.body) {
            if (result.body[child] instanceof View) {
                result.body[child] = View.renderToVirtualDomNode(result.body[child], { save })
            } else if (result.body[child] instanceof VNode) {
                continue
            } else {
                throw new InvalidValueException(`Unexpected child passed (child: ${result.body[child].constructor.name})`)
            }
        }

        if (save) {
            for (let i in views) {
                views[i].lastRender = result
            }
        }
        
        return result
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

        this.modifiers.push(modifier)

        if (this.lastRender && this.lastRender.dom) {
            this.invalidate({ useIdleCallback: true })
        }

        return this
    }

    /**
     * Method to add padding to the view (using padding modifier)
     */
    padding (edge = Edge.all, size = pixels(10)) {
        this.modifier(new PaddingModifier(edge, size))
        return this
    }

    /**
     * Method to set the font of the view (using font modifier)
     * @param {Font} font 
     */
    font (font) {
        this.modifier(new FontModifier(font))
        return this
    }
}
