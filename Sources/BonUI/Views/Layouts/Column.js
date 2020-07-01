//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBody, flattenArray, verticalAlignmentToJustifyContent } from "../../Values/Helpers.js"
import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { VerticalAlignment } from "../../Values/Alignment.js"
import { pixels, Length } from "../../Values/Length.js"
import { Spacer } from "../Generic/Spacer.js"
import { View } from "../View.js"
import "../../jsdoc.js"

export class Column extends View {
    /**
     * @param {Body}            items               items of column
     * @param {*}               [options]
     * @param {Symbol}          [options.alignment] item of `VerticalAlignment` enum
     * @param {number|Length}   [options.spacing]   space between items
     */
    constructor (items, { alignment = VerticalAlignment.center, spacing = 10 } = {}) {
        super()

        if (!(spacing instanceof Length || typeof spacing === "number")) {
            throw new InvalidValueException(`Spacing must be Length instance or number`)
        }

        if (!(VerticalAlignment.contains(alignment))) {
            throw new InvalidValueException(`VerticalAlignment enum does not contain item passed`)
        }

        this.items = items
        this.alignment = alignment
        this.spacing = spacing instanceof Length ? spacing : pixels(spacing)
    }

    body () {
        var items = convertToViewBody(this.items)
        
        if (this.spacing.value !== 0) {
            items = flattenArray(
                items.map(item => [
                    item, 
                    new Spacer()
                        .size({ height: this.spacing })
                ])
            ).slice(0, -1)
        }

        const styles = {
            display: "flex",
            flexDirection: "column",
            justifyContent: verticalAlignmentToJustifyContent(this.alignment),
            alignItems: "stretch"
        }

        return new ContainerVNode({
            component: "div",
            body: items,
            styles
        })
    }
}
