//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { PositionModifier } from "../../Modifiers/PositionModifier.js"
import { convertToViewBody } from "../../Values/Helpers.js"
import { Position } from "../../Values/Enums/Position.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"
import "../../jsdoc.js"

/**
 * View that represents stack of the items on the Z axis.
 * ZStack sets the `zIndex` value on each of the child items if it's not set.
 * @example
 * new ZStack([
 *     new Text("Layer 1")
 *         .padding(20),
 *     new Text("Layer 2")
 *         .padding(20)
 *         .position(Position.absolute)
 *         .offset({ x: 30, y: 35 })
 *         .background(Color.yellow)
 * ])
 * @category Views
 * @subcategory Layouts
 */
export class ZStack extends View {
    /**
     * 
     * @param {Body} items 
     */
    constructor (items) {
        super()
        this.items = items
    }

    get body () {
        var items = convertToViewBody(this.items)

        for (let i in items) {
            if (items[i] instanceof VNode) {
                items[i].styles.position = items[i].styles.position || "relative"
                items[i].styles.zIndex = i
            } else if (items[i] instanceof View) {
                items[i].prependVNodeModifier(new PositionModifier(Position.relative))
                items[i].zIndex(parseInt(i))
            }
        }

        return new VNode("div", {
            body: items,
            styles: {
                position: "relative"
            }
        })
    }
}
