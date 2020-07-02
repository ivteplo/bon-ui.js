//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { getClass } from "../../Values/Helpers.js"
import { View } from "../View.js"

export class Image extends View {
    constructor ({ path, description = "Image" } = {}) {
        super()

        if (typeof path !== "string") {
            throw new InvalidValueException(`Expected path to image to be a string, got ${getClass(path)}`)
        }

        this.path = path
        this.description = description
    }

    body () {
        return (
            new ContainerVNode({
                component: "img",
                attributes: {
                    src: this.path,
                    alt: this.description
                },
                styles: {
                    fitType: "cover",
                    maxWidth: "100%",
                    maxHeight: "100%"
                }
            })
        )
    }
}
