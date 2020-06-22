//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewModifier } from "./ViewModifier.js"

export class DOMEventListenerModifier extends ViewModifier {
    /**
     * @param {string}   eventName
     * @param {function} handler
     */
    constructor (eventName, handler) {
        super()

        if (typeof eventName !== "string") {
            throw new InvalidValueException(`Expected string as an event name, got ${typeof eventName}`)
        }

        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as a handler, got ${typeof handler}`)
        }

        this.eventName = eventName
        this.handler = handler
    }

    body (content) {
        if (content instanceof ContainerVNode) {
            const handlers = Object.assign(content.handlers)
            
            if (!(this.eventName in handlers && handlers[this.eventName])) {
                handlers[this.eventName] = []
            }

            if (!Array.isArray(handlers[this.eventName])) {
                handlers[this.eventName] = [ handlers[this.eventName] ]
            }

            handlers[this.eventName].push(this.handler)
            
            return (
                new ContainerVNode({
                    ...content,
                    handlers
                })
            )
        } else {
            const handlers = {}
            handlers[this.eventName] = this.handler

            return (
                new ContainerVNode({
                    component: "div",
                    handlers
                })
            )
        }
    }
}
