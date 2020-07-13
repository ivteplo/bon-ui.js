//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBody, flattenArray, verticalAlignmentToAlignItems } from "../../Values/Helpers.js"
import { VerticalAlignment } from "../../Values/Enums/Alignment.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { Spacer } from "../Generic/Spacer.js"
import { Column } from "./Column.js"

/**
 * View that represents the row of items.
 * @example
 * new Row([
 *     new Text("Title")
 *         .font(Font.largeTitle),
 *     new Text("Description")
 *         .foregroundColor(Color.secondary)
 * ])
 * @category Views 
 * @subcategory Layouts
 */
export class Row extends Column {
    /**
     * @param {Body}            items               items of column
     * @param {*}               [options]
     * @param {Symbol}          [options.alignment] item of `VerticalAlignment` enum
     * @param {number|Length}   [options.spacing]   space between items
     */
    constructor (items, { alignment = VerticalAlignment.center, spacing = 10 } = {}) {
        super(items, { spacing })

        if (!(VerticalAlignment.contains(alignment))) {
            throw new InvalidValueException(`VerticalAlignment enum does not contain item passed`)
        }

        this.alignment = alignment
    }

    get body () {
        var items = convertToViewBody(this.items)
        
        if (this.spacing.value !== 0) {
            items = flattenArray(
                items.map((item, index) => {                    
                    if (item instanceof Spacer || (index < items.length - 1 && items[index + 1] instanceof Spacer) || index === items.length - 1) {
                        return item
                    }

                    return [
                        item,
                        new Spacer().size({ width: this.spacing })
                    ]
                })
            )
        }

        return new VNode("bon-ui-row", {
            body: items,
            styles: {
                alignItems: verticalAlignmentToAlignItems(this.alignment)
            }
        })
    }
}
