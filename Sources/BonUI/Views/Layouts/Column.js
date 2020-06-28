//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Alignment, alignmentToCSSFlexBoxAlignment } from "../../Values/Alignment.js"
import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { flattenArray } from "../../Values/Array.js"
import { View } from "../View.js"

export class Column extends View {
    constructor (items, { alignment = Alignment.center } = {}) {
        super()
        this.items = items
        this.alignment = alignment
    }

    body () {
        var { items } = this

        if (typeof items === "function") {
            items = items()
        }

        if (!Array.isArray(items)) {
            items = [ items ]
        }

        items = flattenArray(items).filter(v => Boolean(v))

        return new ContainerVNode({
            component: "div",
            body: items,
            styles: {
                display: "flex",
                flexDirection: "column",
                justifyContent: alignmentToCSSFlexBoxAlignment(this.alignment)
            }
        })
    }
}
