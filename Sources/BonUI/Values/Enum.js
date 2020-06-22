//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

/**
 * A class that is used to represent the enum
 */
export class Enum {
    /**
     * @param {String} ...items The names of the items in the enum
     */
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
     * A method to check if enum contains the item
     * @param {Symbol} item 
     * @returns {Boolean}
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
     * A method to get the string identifier of the enum item
     * @param {Symbol} item 
     * @returns {String|undefined} Undefined if there is no such item in the enum
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

