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
 * @public @class
 * @description The response, returned by ViewState after changing it
 */
export class ViewStateResponse {
    /**
     * 
     * @param {{
     *  type: String,
     *  updated: Boolean,
     *  message: String
     * }} param0 
     */
    constructor ({ type, updated, message }) {
        this.type = type
        this.updated = updated
        this.message = message
    }

    toString () {
        return this.message
    }
}
