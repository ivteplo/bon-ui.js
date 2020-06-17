//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VStack } from "./VStack.js"
import { Axis } from "../../Values/Axis.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { percents } from "../../Values/Length.js"

export class ScrollView extends VStack {
    constructor (...args) {
        super(...args)
        this.maxSize({ height: percents(100), width: percents(100) })
    }

    /**
     * Method to set which axises are scrollable
     * @param {Symbol} axis item of Axis enum
     */
    scrollAxis (axis) {
        if (axis === Axis.horizontal) {
            this._styles.overflowX = "scroll"
        } else if (axis === Axis.vertical) {
            this._styles.overflowY = "scroll"
        } else if (axis === Axis.both) {
            this._styles.overflow = "scroll"
        }

        return this
    }
}

