//
// Enum.js
// Created on 08/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

export class Enum {
    constructor (...items) {
        for (let i of items) {
            if (!(typeof i === "string" || i instanceof String)) {
                throw new Error("Unexpected item " + i + " in enum")
            }

            this[i.toString()] = Symbol(i.toString())
        }

        Object.freeze(this)
    }

    /**
     * @description A method to check if enum contains the item
     * @param {Symbol} item 
     * @returns {boolean}
     */
    contains (item) {
        for (let i in this) {
            if (this[i] === item) {
                return true
            }
        }

        return false
    }

    /**
     * @description A method to get the string identifier of the enum item
     * @param {Symbol} item 
     * @returns {string|undefined}
     */
    getIdentifier (item) {
        for (let i in this) {
            if (this[i] === item) {
                return i
            }
        }

        return undefined
    }
}
