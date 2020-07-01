//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { ViewVNodeModifier } from "./ViewVNodeModifier.js"

export class CSSModifier extends ViewVNodeModifier {
    /**
     * 
     * @param {object} cssStyles a `key: value` pair of CSS styles
     */
    constructor (cssStyles) {
        super()
        this.cssStyles = cssStyles
    }

    body (content) {
        const styles = typeof this.cssStyles === "object"? this.cssStyles : {}

        if (!(content instanceof ContainerVNode)) {
            return new ContainerVNode({
                component: "div",
                body: [ content ],
                styles
            })
        } else {
            content.styles = Object.assign(content.styles, styles)
            return content
        }
    }
}
