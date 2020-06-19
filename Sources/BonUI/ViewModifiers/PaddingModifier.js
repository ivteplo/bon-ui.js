//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Edge } from "../Values/Edge.js"
import { Length } from "../Values/Length.js"
import { ViewModifier } from "./ViewModifier.js"
import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"

export class PaddingModifier extends ViewModifier {
    /**
     * @param {Symbol}        edge item of Edge enum
     * @param {Length|Number} size size of padding
     */
    constructor (edge, size) {
        super()

        if (!Edge.contains(edge)) {
            throw new InvalidValueException(`Expected Edge enum item as edge, got unexpected ${typeof edge}`)
        }

        if (!(size instanceof Length)) {
            throw new InvalidValueException(`Expected Length instance as size, got ${typeof edge === "object" ? edge.constructor.name : typeof edge}`)
        }

        this.edge = edge
        this.size = size
    }

    body (content) {
        const styles = {}
        switch (this.edge) {
            case Edge.top:
                styles.paddingTop = this.size
                break
            case Edge.bottom:
                styles.paddingBottom = this.size
                break
            case Edge.left:
                styles.paddingLeft = this.size
                break
            case Edge.right: 
                styles.paddingLeft = this.size
                break
            case Edge.all:
                styles.padding = this.size
                break
        }

        if (content instanceof ContainerVNode) {
            var _styles = Object.assign(content.styles, styles)
            return (
                new ContainerVNode({
                    ...content,
                    styles: _styles
                })
            )
        } else {
            return (
                new ContainerVNode({
                    component: "div",
                    body: content,
                    styles
                })
            )
        }
    }
}
