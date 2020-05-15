//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View"
import { FitType, fitTypeToCssValue } from "../../Values/FitType"

/**
 * A view that represents the Image
 * @class
 * @extends View
 */
export class Image extends View {
    /**
     * @param {Object} options
     * @param {String} options.url      URL to the image
     * @param {String} options.altText  The text that will be shown if the image is not loaded
     */
    constructor({ url, altText = "" }) {
        super({ url, altText })
    }

    /**
     * A method to set the fit type of the image
     * @param {Symbol} type Item of the FitType enum
     */
    fitType(type) {
        if (FitType.contains(type)) {
            this.styles.objectFit = fitTypeToCssValue(type)
        }

        return this
    }

    body() {
        var vNode = super.body()
        vNode.tag = "img"
        vNode.attributes.src = this.options.url
        vNode.attributes.alt = this.options.altText ? this.options.altText : "image"

        return vNode
    }
}
