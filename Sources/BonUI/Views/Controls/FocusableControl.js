//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { EventHandlerModifier } from "../../Modifiers/EventHandlerModifier.js"
import { Control } from "./Control.js"

export class FocusableControl extends Control {
    /**
     * Method to set handler for "focus" event
     * @param {function} handler function that is called when view gets focused
     */
    onFocus (handler) {
        return this.modifier(new EventHandlerModifier("focus", handler))
    }

    /**
     * Method to set handler for losing focus ("blur") event
     * @param {function} handler function that is called when view lost focus
     */
    onFocusLost (handler) {
        return this.modifier(new EventHandlerModifier("blur", handler))
    }
}
