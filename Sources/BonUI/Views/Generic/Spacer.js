//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { Length, pixels } from "../../Values/Length.js"
import { View } from "../View.js"

export class Spacer extends View {
    constructor (minSize = pixels(10)) {
        if (!(minSize instanceof Length)) {
            throw new InvalidValueException(`Unexpected value passed as the minimum size of Spacer. Expected Length instance, got ${
                typeof minSize === "object" ? minSize.constructor.name : typeof minSize}`)
        }

        super()
        this.minSize = minSize
    }

    body () {
        return new ContainerVNode({
            component: "div",
            styles: {
                margin: "auto",
                flexBasis: this.minSize.toString(),
                flexShrink: "0"
            }
        })
    }
}
