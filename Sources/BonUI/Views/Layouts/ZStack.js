//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { PositionModifier } from "../../ViewModifiers/PositionModifier.js"
import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { convertToViewBody } from "../../Values/Helpers.js"
import { Position } from "../../Values/Position.js"
import { View } from "../View.js"
import "../../jsdoc.js"

export class ZStack extends View {
    /**
     * 
     * @param {Body} items 
     */
    constructor (items) {
        super()
        this.items = items
    }

    body () {
        var items = convertToViewBody(this.items)

        for (let i in items) {
            if (items[i] instanceof ContainerVNode) {
                items[i].styles.position = items[i].styles.position || "relative"
                items[i].styles.zIndex = i
            } else if (items[i] instanceof View) {
                items[i]._vNodeModifiers.unshift(new PositionModifier(Position.relative))
                items[i].zIndex(parseInt(i))
            }
        }

        return new ContainerVNode({
            component: "div",
            body: items,
            styles: {
                position: "relative"
            }
        })
    }
}
