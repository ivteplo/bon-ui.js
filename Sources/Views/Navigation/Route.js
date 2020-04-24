//
// Route.js
// Created on 18/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"

function pathMatches(pathname, { path, exact }) {
    if (!path) {
        return { path: null, url: pathname, isExact: true }
    }

    const matches = new RegExp(`^${path}`).exec(pathname)

    if (!matches) {
        return null
    }

    const url = matches[0]
    const isExact = pathname === url

    if (exact && !isExact) {
        return null
    }

    return {
        path: path,
        url: url,
        isExact: isExact
    }
}

/**
 * View that is used to represent one route
 */
export class Route extends View {
    /**
     * @param {Object}  options
     * @param {String}  options.path    Path of the route
     * @param {Boolean} options.exact   Check if path is exact
     * @param {View}    options.view    View that will be loaded
     */
    constructor(options) {
        super(options)
    }

    getBody() {
        return this.options.view
    }

    /**
     * Method to check if path passed is equal to this route path
     * @param {String} path Current path
     */
    pathMatches(path) {
        return pathMatches(path, { path: this.options.path, exact: (this.options.exact === undefined ? true : this.options.exact) })
    }
}

