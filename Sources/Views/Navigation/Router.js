//
// Router.js
// Created on 18/04/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { Route } from "./Route"

/**
 * View that is used for routing
 */
export class Router extends View {
    /**
     * @param {String}  path    Current web path
     * @param {Route[]} routes  Routes for the app
     */
    constructor(path, routes) {
        super({ path, routes })
    }

    getBody() {
        for (let i in this.options.routes) {
            if (this.options.routes[i] instanceof Route && this.options.routes[i].pathMatches(this.options.path)) {
                let node = this.options.routes[i].getBody()
                return node
            }
        }

        return null
    }
}

