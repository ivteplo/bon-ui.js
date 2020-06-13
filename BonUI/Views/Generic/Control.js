//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"

/**
 * A class that is used to implement controls
 * @class
 * @extends View
 */
export class Control extends View {
    initialState() {
        return { active: true }
    }

    /**
     * A method to deactivate the control
     */
    disable() {
        this.state.set({
            active: false
        })

        return this
    }

    /**
     * A method to enable the control
     */
    enable() {
        this.state.set({
            active: true
        })

        return this
    }

    /**
     * A method to activate/deactivate the control
     * @param {Boolean} value If true then the control will be active, else disabled
     */
    setActiveTo(value) {
        if (typeof value === "boolean" || value instanceof Boolean) {
            this.state.set({
                active: Boolean(value)
            })
        }

        return this
    }

    body () {
        var vNode = super.body()
        if (!this.state.get("active")) {
            vNode.attributes.disabled = "disabled"
        }
        return vNode
    }
}
