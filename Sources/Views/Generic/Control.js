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
 * A class that is used to implement controls
 * @class
 * @extends View
 */
export class Control extends View {
    getInitialState() {
        return { active: true }
    }

    /**
     * A method to deactivate the control
     */
    disable() {
        this.state.set("active", false)
        return this
    }

    /**
     * A method to activate the control
     */
    activate() {
        this.state.set("active", true)
        return this
    }

    /**
     * A method to activate/deactivate the control
     * @param {Boolean} value If true then the control will be active, else disabled
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
