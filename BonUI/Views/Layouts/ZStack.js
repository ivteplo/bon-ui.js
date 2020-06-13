//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { flattenArray } from "../../Values/Array.js"
import { Positioning } from "../../Values/Positioning.js"

/**
 * A view that represents the z-axis stack (the layers order)
 * @class
 * @extends View
 */
export class ZStack extends View {
    /**
     * @param {Array<View|VNode>} children Items of the stack
     */
    constructor (children) {
        super({ children })
        this.positioning({ type: Positioning.relative })
    }

    body () {
        var { children } = this.options

        if (children instanceof Function) {
            children = children()
        }

        if (!Array.isArray(children)) {
            children = children ? [children] : []
        }

        children = flattenArray(children)

        var vNode = super.body()
        vNode.tag = "div"
        vNode.body = children.filter(value => value != null)

        for (let i = 0; i < vNode.body.length; ++i) {
            if (vNode.body[i] instanceof View) {
                vNode.body[i].applyCSS({
                    zIndex: i
                })

                if (vNode.body[i]._styles.position == undefined) {
                    vNode.body[i].positioning({ type: Positioning.relative })
                }
            } else if (vNode.body[i] instanceof VNode) {
                vNode.body[i].styles.zIndex = i

                if (vNode.body[i].styles.position == undefined) {
                    vNode.body[i].styles.position = "relative"
                }
            }
        }
        
        return vNode
    }
}
