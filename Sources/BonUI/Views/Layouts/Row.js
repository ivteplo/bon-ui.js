//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBody, flattenArray, horizontalAlignmentToJustifyContent } from "../../Values/Helpers.js"
import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { HorizontalAlignment } from "../../Values/Alignment.js"
import { Spacer } from "../Generic/Spacer.js"
import { Column } from "./Column.js"

export class Row extends Column {
    /**
     * @param {Body}            items               items of column
     * @param {*}               [options]
     * @param {Symbol}          [options.alignment] item of `HorizontalAlignment` enum
     * @param {number|Length}   [options.spacing]   space between items
     */
    constructor (items, { alignment = HorizontalAlignment.center, spacing = 10 } = {}) {
        super(items, { spacing })

        if (!(HorizontalAlignment.contains(alignment))) {
            throw new InvalidValueException(`HorizontalAlignment enum does not contain item passed`)
        }

        this.alignment = alignment
    }

    body () {
        var items = flattenArray(
            convertToViewBody(this.items).map(item => [
                item, 
                new Spacer()
                    .size({ width: this.spacing })
            ])
        )

        const styles = {
            display: "flex",
            flexDirection: "row",
            justifyContent: horizontalAlignmentToJustifyContent(this.alignment),
            alignItems: "stretch"
        }

        return new ContainerVNode({
            component: "div",
            body: items,
            styles
        })
    }
}
