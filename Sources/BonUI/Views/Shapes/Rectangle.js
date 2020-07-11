//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Length, pixels, percents } from "../../Values/Length.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { svgXmlNamespace } from "../../Config.js"
import { Circle } from "./Circle.js"

/**
 * View that represents the rectangle shape.
 * @example
 * new Rectangle()
 *     .size({ width: 200, height: 200 })
 *     .foregroundColor(Color.yellow)
 *     .corcerRadius(10)
 * @category Views
 * @subcategory Shapes
 */
export class Rectangle extends Circle {
    constructor () {
        super()
        this._cornerRadius = pixels(0)
    }

    /**
     * Method to set corner radius of the rectangle
     * @param {Length|number} radius radius of the corners
     */
    cornerRadius (radius) {
        this._cornerRadius = radius instanceof Length ? radius : pixels(radius)
        return this
    }

    get body () {
        const size = (
            this._strokeWidth.value !== 0
                ? `calc(100% - ${this._strokeWidth} * 2)`
                : percents(100)
        )
        
        const coordinates = this._strokeWidth.toString()
        
        return new VNode("svg", {
            styles: {
                overflow: "visible"
            },
            body: [
                new VNode("rect", {
                    attributes: {
                        x: coordinates,
                        y: coordinates,
                        width: size,
                        height: size,
                        rx: this._cornerRadius.toString(),
                        ry: this._cornerRadius.toString(),
                        fill: "currentColor",
                        "stroke-width": this._strokeWidth.toString(),
                        stroke: this._strokeColor.toString()
                    },
                    xmlNamespace: svgXmlNamespace
                })
            ],
            xmlNamespace: svgXmlNamespace
        })
    }
}
