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
 * @public @class
 * @description A view state that contains variables. When you change them through the method "set", the component will be invalidated
 */
export class ViewState {
    constructor () {
        this._values = {}
        this._changeHandler = () => {}
    }

    restore () {
        this._values = {}
        this._changeHandler = () => {}
    }

    /**
     * @description A method to add callback on state change, which was completed successfully
     * @param {function} callback 
     */
    setChangeHandler (callback) {
        if (typeof callback === "function") {
            this._changeHandler = callback
        }
    }

    /**
     * @description A method to set the value for the state item
     * @param {string} key 
     * @param {*} value 
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
        }

        return new ViewStateResponse({
            type: "error",
            updated: false,
            message: "ViewState could not update, because the key passed is not a string"
        })
    }

    /**
     * @description A method to get the value of the state item
     * @param {string} key 
     */
    get (key) {
        if (typeof key === "string" || key instanceof String) {
            return this._values[key.toString()]
        }

        return undefined
    }
}
