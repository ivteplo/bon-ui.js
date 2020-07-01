//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewVNodeModifier } from "./ViewVNodeModifier.js"

export class EventHandlerModifier extends ViewVNodeModifier {
    constructor (event, handler = () => {}) {
        super()

        if (typeof event !== "string") {
            throw new InvalidValueException(`Expected string as the event name, got ${typeof event}`)
        }

        if (typeof handler !== "function") {
            throw new InvalidValueException(`Expected function as the handler for event "${event}"`)
        }

        this.event = event
        this.handler = handler
    }

    body (content) {
        const handlers = {}
        handlers[this.event] = this.handler
        
        if (!(content instanceof ContainerVNode)) {
            return (
                new ContainerVNode({
                    component: "div",
                    body: [ content ],
                    handlers
                })
            )
        } else {
            content.handlers = handlers
            return content
        }
    }
}
