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

export class Circle extends View {
    constructor () {
        super()
        this._strokeWidth = pixels(0)
        this._strokeColor = Color.transparent
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

    get body () {
        const size = (
            this._strokeWidth.value !== 0
                ? `calc(100% - ${this._strokeWidth} * 2)`
                : percents(100)
        )
        
        return new VNode("svg", {
            styles: {
                overflow: "visible"
            },
            body: [
                new VNode("circle", {
                    attributes: {
                        cx: "50%",
                        cy: "50%",
                        r: size,
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
