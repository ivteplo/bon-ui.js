//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBody, flattenArray, horizontalAlignmentToAlignItems } from "../../Values/Helpers.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { HorizontalAlignment } from "../../Values/Enums/Alignment.js"
import { pixels, Length } from "../../Values/Length.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { Spacer } from "../Generic/Spacer.js"
import { View } from "../View.js"
import "../../jsdoc.js"

export class Column extends View {
    /**
     * @param {Body}            items               items of column
     * @param {*}               [options]
     * @param {Symbol}          [options.alignment] item of `HorizontalAlignment` enum
     * @param {number|Length}   [options.spacing]   space between items
     */
    constructor (items, { alignment = HorizontalAlignment.center, spacing = 10 } = {}) {
        super()

        if (!(spacing instanceof Length || typeof spacing === "number")) {
            throw new InvalidValueException(`Spacing must be Length instance or number`)
        }

        if (!(HorizontalAlignment.contains(alignment))) {
            throw new InvalidValueException(`HorizontalAlignment enum does not contain item passed`)
        }

        this.items = items
        this.alignment = alignment
        this.spacing = spacing instanceof Length ? spacing : pixels(spacing)
        
        var containsSpacer = false
        this.containsSpacer = containsSpacer

        Object.defineProperty(this, "containsSpacer", {
            get () {
                return containsSpacer
            },
            set: (value) => {
                containsSpacer = value

                if (this.parent && "containsSpacer" in this.parent) {
                    this.parent.containsSpacer = value
                }
            }
        })
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
            justifyContent: "center",
            alignItems: horizontalAlignmentToAlignItems(this.alignment)
        }

        return new VNode("div", {
            body: items,
            styles
        })
    }
}
