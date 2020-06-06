//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VStack } from "./VStack.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { percents } from "../../Values/Length.js"

export class ScrollView extends VStack {
    constructor (...args) {
        super(...args)
        this.maxSize({ height: percents(100), width: percents(100) })
    }

    /**
     * @param {Object}  options
     * @param {Boolean} [options.horizontal]    make horizontal axis scrollable
     * @param {Boolean} [options.vertical]      make vertical axis scrollable
     * @param {Boolean} [options.both]          make both vertical and horizontal axises scrollable
     */
    scrollAxis ({ horizontal, vertical, both } = {}) {
        if (typeof both === "boolean") {
            this._styles.overflow = "scroll"
        }

        if (typeof horizontal === "boolean") {
            this._styles.overflowX = "scroll"
        }

        if (typeof vertical === "boolean") {
            this._styles.overflowY = "scroll"
        }

        return this
    }
}

