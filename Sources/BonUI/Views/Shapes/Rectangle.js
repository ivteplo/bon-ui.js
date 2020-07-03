//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { Length, pixels, percents } from "../../Values/Length.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { getClass } from "../../Values/Helpers.js"
import { svgXmlNamespace } from "../../Config.js"
import { Color } from "../../Values/Color.js"
import { View } from "../View.js"

export class Rectangle extends View {
    constructor () {
        super()
        this._cornerRadius = pixels(0)
        this._strokeWidth = pixels(0)
        this._strokeColor = Color.transparent
    }

    /**
     * Method to set corner radius of the rectangle
     * @param {Length|number} radius radius of the corners
     */
    cornerRadius (radius) {
        this._cornerRadius = radius instanceof Length ? radius : pixels(radius)
        return this
    }

    /**
     * Method to set the stroke of the rectangle
     * @param {Length|number}   width width of the stroke
     * @param {Color}           color stroke color
     */
    stroke (width = pixels(2), color = Color.text) {
        if (!(color instanceof Color)) {
            throw new InvalidValueException(`Expected Color instance as stroke color, got ${getClass(color)}`)
        }
        
        this._strokeWidth = width instanceof Length ? width : pixels(width)
        this._strokeColor = color
        return this
    }

    body () {
        const size = (
            this._strokeWidth.value !== 0
                ? `calc(100% - ${this._strokeWidth} * 2)`
                : percents(100)
        )
        
        const coordinates = this._strokeWidth.toString()
        
        return new VNode("svg", {
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
