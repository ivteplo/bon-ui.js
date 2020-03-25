//
// Control.js
// Created on 25/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"

/**
 * @public @class
 * @extends View
 */
export class Control extends View {
    constructor () {
        super()
    }

    getInitialState() {
        return { active: true }
    }

    /**
     * @description A method to deactivate the control
     */
    disable() {
        this.state.set("active", false)
        return this
    }

    /**
     * @description A method to activate the control
     */
    activate() {
        this.state.set("active", true)
        return this
    }

    /**
     * @description A method to activate/deactivate the control
     * @param {boolean} value
     */
    setActiveTo(value) {
        if (typeof value === "boolean" || value instanceof Boolean) {
            this.state.set("active", Boolean(value))
        }

        return this
    }

    getBody () {
        var vNode = super.getBody()
        if (!this.state.get("active")) {
            vNode.attributes.disabled = "disabled"
        }
        return vNode
    }
}
