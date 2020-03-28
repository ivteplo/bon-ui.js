//
// ViewState.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { ViewStateResponse } from "./ViewStateResponse"

/**
 * A view state that contains variables. When you change them through the method "set", the component will be invalidated
 * @class
 */
export class ViewState {
    constructor () {
        this._values = {}
        this._changeHandler = () => {}
    }

    /**
     * A function to clear the state
     */
    restore () {
        this._values = {}
        this._changeHandler = () => {}
    }

    /**
     * A method to add callback on state change, which was completed successfully
     * @param {Function} callback A function that will be called after the state was successfully updated
     */
    setChangeHandler (callback) {
        if (typeof callback === "function") {
            this._changeHandler = callback
        }
    }

    /**
     * A method to set the value for the state item
     * @param {string|object} key 
     * @param {*} value 
     * @example
     * var view = new View()
     * view.state.set({
     *  name: "Tom",
     *  surname: "Johns"
     * })
     * 
     * view.state.set("surname", "Smith")
     */
    set (key, value) {
        if (typeof key === "string" || key instanceof String) {
            this._values[key.toString()] = value
            this._changeHandler()

            return new ViewStateResponse({
                type: "success",
                updated: true,
                message: "ViewState has been updated successfully"
            })
        } else if (typeof key === "object") {
            for (let k in key) {
                this._values[k.toString()] = key[k]
            }

            this._changeHandler()

            return new ViewStateResponse({
                type: "success",
                updated: true,
                message: "ViewState has been updated successfully"
            })
        }

        return new ViewStateResponse({
            type: "error",
            updated: false,
            message: "ViewState could not update, because the key passed is not a string"
        })
    }

    /**
     * A method to get the value of the state item
     * @param {string} key A name of the state variable
     */
    get (key) {
        if (typeof key === "string" || key instanceof String) {
            return this._values[key.toString()]
        }

        return undefined
    }
}
