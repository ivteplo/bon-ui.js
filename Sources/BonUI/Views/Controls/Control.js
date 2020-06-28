//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { State } from "../../Values/State.js"
import { View } from "../View.js"

export class Control extends View {
    constructor (...args) {
        super(...args)

        this.controlState = new State((state = { enabled: true }, action) => {
            switch (action.type) {
                case "set":
                    return Object.assign(state, action.value)
                default:
                    return state
            }
        })

        this.controlState.subscribe(this.update.bind(this))
    }

    /**
     * Method to enable or disable the control
     * @param {boolean} value enabled (`true`) or disabled (`false`)
     */
    enabled (value = true) {
        this.controlState.dispatch({
            type: "set",
            value: {
                enabled: Boolean(value)
            }
        })

        return this
    }
}
