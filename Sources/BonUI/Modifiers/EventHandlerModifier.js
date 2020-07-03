//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

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
        if (!content.handlers[this.event]) {
            content.handlers[this.event] = []
        }

        content.handlers[this.event].push(this.handler)
        return content
    }
}