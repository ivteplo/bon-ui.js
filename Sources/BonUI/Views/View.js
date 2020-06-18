//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { flattenArray } from "../Values/Array.js"
import { Protocol } from "../Values/Protocol.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { State } from "../Values/State.js"

const ViewProtocol = Protocol.createClass({
    requiredMethods: [ "body" ]
})

/** 
 * @todo think about how to update 
 * the styles/attributes/handlers when 
 * used a modifier */

/**
 * A class to respresent the UI item
 */
export class View extends ViewProtocol {
    constructor () {
        super()
        this._prefersForceInvalidation = false
        this.lastRender = null

        this.state = new State((state = this.initialState(), action) => {
            switch (action.type) {
                case "set":
                    return Object.assign(state, action.value)
                default:
                    return state
            }
        })

        this.state.subscribe(() => {
            this.invalidate()
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

    /** @todo */
    invalidate () {
        if (this.lastRender === null) {
            return
        }

        const render = View.renderToVirtualDomNode(this)
        // debugger
        render.updateDomNode(this.lastRender, this.lastRender.dom)
        this.lastRender = render
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

        while (result instanceof View) {
            views.push(view)
            result = result.body()
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
}
