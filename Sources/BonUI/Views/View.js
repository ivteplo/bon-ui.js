//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ViewController } from "../Application/ViewController.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewModifier } from "../ViewModifiers/ViewModifier.js"
import { Protocol } from "../Values/Protocol.js"
import { State } from "../Values/State.js"
import { Worker } from "../Worker.js"

const ViewProtocol = Protocol.createClass({
    requiredMethods: [ "body" ]
})

/**
 * Class that respresents UI item
 */
export class View extends ViewProtocol {
    constructor () {
        super()

        /**
         * @var
         * Controller of the view
         */
        this.controller = new ViewController(this)

        /**
         * @var
         * State instance
         */
        this.state = new State((state = this.initialState(), action) => {
            switch (action.type) {
                case "set":
                    return Object.assign(state, action.value)
                default:
                    return state
            }
        })

        this.state.subscribe(() => {
            Worker.addUnitOfWork(() => {
                this.controller.updateView()
            })
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

    // View modifiers section

    /**
     * Method to add view modifier
     * @param {ViewModifier} modifier 
     */
    modifier (modifier) {
        if (!(modifier instanceof ViewModifier)) {
            throw new InvalidValueException(`Unexpected modifier passed (expected ViewModifier instance, got ${modifier.constructor.name})`)
        }

        return modifier.body(this)
    }
}
