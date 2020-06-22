//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewModifier } from "./ViewModifier.js"
import { Color } from "../Values/Color.js"

export class ForegroundModifier extends ViewModifier {
    /**
     * @param {Color} color
     */
    constructor (color) {
        super()

        if (!(color instanceof Color)) {
            throw new InvalidValueException(`Expected Font instance as font, got ${font.constructor.name}`)
        }

        this.color = color
    }

    body (content) {
        const color = this.color.toString()
        
        if (content instanceof ContainerVNode) {
            const styles = Object.assign(content.styles, {
                color: color,
                fill: color
            })

            return (
                new ContainerVNode({
                    ...content,
                    styles
                })
            )
        } else {
            return (
                new ContainerVNode({
                    component: "div",
                    styles: { color }
                })
            )
        }
    }
}
