//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { Route } from "./Route.js"

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

    body() {
        for (let i in this.options.routes) {
            if (this.options.routes[i] instanceof Route && this.options.routes[i].pathMatches(this.options.path)) {
                let node = this.options.routes[i].body()
                return node
            }
        }

        return null
    }
}

