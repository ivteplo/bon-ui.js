//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

/**
 * A state that contains variables. When you change them through the method "set", the component will be invalidated
 * @class
 */
export class State {
    /**
     * @param {function} reducer Function that is an action handler
     */
    constructor (reducer) {
        this._listeners = []
        this._currentState = reducer(undefined, {})
        this._reducer = reducer
    }

    get current () {
        return this._currentState
    }

    /**
     * Method to call an action on the state
     * @param {object} action Information about an action
     */
    dispatch (action) {
        this._currentState = this._reducer(this._currentState, action)

        this._listeners.forEach(listener => {
            listener()
        })
    }

    /**
     * Method to add listener for the state change
     * @param   {function} listener Listener to the state change
     * @returns {function} Function to remove this listener
     */
    subscribe (listener) {
        this._listeners.push(listener)

        const unsubscribe = () => {
            this._listeners = this._listeners.filter(item => item !== listener)
        }

        return unsubscribe
    }
}

