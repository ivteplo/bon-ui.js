//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../../Values/Exceptions.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { getClass } from "../../Values/Helpers.js"
import { View } from "../View.js"

/**
 * View that represents the image.
 * @example
 * new Image({
 *     path: "https://github.com/teplovs/bon-ui/raw/master/logo.png",
 *     description: "Bon UI Logo"
 * }).size({ width: 200 })
 * @category Views 
 * @subcategory Generic
 */
export class Image extends View {
    /**
     * 
     * @param {object} options
     * @param {string} options.path image file path
     * @param {string} options.description description of the image
     */
    constructor ({ path, description = "Image" } = {}) {
        super()

        if (typeof path !== "string") {
            throw new InvalidValueException(`Expected path to image to be a string, got ${getClass(path)}`)
        }

        this.path = path
        this.description = description
    }

    get body () {
        return (
            new VNode("img", {
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
