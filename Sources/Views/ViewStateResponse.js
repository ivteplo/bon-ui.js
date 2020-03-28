//
// ViewStateResponse.js
// Created on 07/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

/**
 * The response, returned by ViewState after changing it
 * @class
 */
export class ViewStateResponse {
    /**
     * @param {Object}  options
     * @param {String}  options.type        Type of the response
     * @param {Boolean} options.updated     Has view updated or not
     * @param {String}  options.message     The message of the response
     */
    constructor ({ type, updated, message }) {
        this.type = type
        this.updated = updated
        this.message = message
    }

    toString () {
        return this.type + ": " + this.message + " (view was " + (this.updated ? "" : "not ") + "updated" 
    }
}
