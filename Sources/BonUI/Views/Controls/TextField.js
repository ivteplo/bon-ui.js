//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { FocusableControl } from "./FocusableControl.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { Length } from "../../Values/Length.js"
import { Color } from "../../Values/Color.js"
import "../../jsdoc.js"
import { EventHandlerModifier } from "../../Modifiers/EventHandlerModifier.js"

/**
 * @callback TextFieldAction
 * @param {TextField} view text field
 */

export class TextField extends FocusableControl {

    /**
     * 
     * @param {object}          [options]   
     * @param {string}          options.placeholder     value that will be shown when text field is empty
     * @param {string}          [options.initialValue]  default value of the text field
     * @param {boolean}         [options.multiline]     multiline or one-lined text field
     * @param {TextFieldAction} [action]                function that will be called each time input value changes
     */
    constructor ({ placeholder, initialValue = "", multiline = false } = {}, action = () => {}) {
        super()

        if (!placeholder) {
            throw new InvalidValueException(`Expected placeholder to be non-empty string`)
        }

        this.action = typeof action === "function" ? action : () => {}
        this.placeholder = placeholder.toString()
        this.initialValue = initialValue ? initialValue.toString() : ""
        this.multiline = Boolean(multiline)
        this.value = initialValue
    }

    /**
     * Method to reset value of the text field to default
     */
    resetValue () {
        this.value = this.initialValue

        if (!(this.controller.vNode && this.controller.vNode.built)) {
            return this
        }

        this.controller.vNode.built.value = this.initialValue
        return this
    }

    /**
     * Method to add handler for input event
     * @param {TextFieldAction} handler method that will be called when text field contents were changed
     */
    onInput (handler) {
        return this.modifier(new EventHandlerModifier("input", () => handler(this)))
    }

    body () {
        return new VNode(this.multiline ? "textarea" : "input", {
            attributes: {
                type: "text",
                value: this.initialValue,
                placeholder: this.placeholder
            },
            styles: {
                padding: Length.defaultPadding,
                color: Color.title,
            },
            handlers: {
                input: [
                    event => {
                        this.value = event.target.value
                        this.action(this)
                    }
                ]
            }
        })
    }
}
