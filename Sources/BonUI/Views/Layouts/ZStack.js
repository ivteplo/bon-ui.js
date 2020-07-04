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
