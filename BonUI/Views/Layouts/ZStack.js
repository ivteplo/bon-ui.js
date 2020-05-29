//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
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
        super()
        this.children = children
        this.positioning({ type: Positioning.relative })
    }

    body () {
        var { children } = this

        if (!Array.isArray(children)) {
            children = children ? [children] : []
        }

        var vNode = super.body()
        vNode.tag = "div"
        vNode.body = children.filter(value => value != null)

        for (let i = 0; i < vNode.body.length; ++i) {
            vNode.body[i].styles.zIndex = i
            
            if (vNode.body[i].styles.position == undefined) {
                vNode.body[i].styles.position = "relative"
            }
        }
        
        return vNode
    }
}
