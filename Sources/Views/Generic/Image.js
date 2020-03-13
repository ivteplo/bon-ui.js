//
// Image.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { FitType, fitTypeToCssValue } from "../../Values/FitType"

export class Image extends View {
    /**
     * @param {string} url 
     * @param {string} altText
     */
    constructor(url, altText) {
        super()
        this.url = url
        this.altText = typeof altText === "string" ? altText : "image"
    }

    /**
     * @description A method to set the fit type of the image
     * @param {Symbol} type 
     */
    setFitType(type) {
        if (FitType.contains(type)) {
            this.styles.objectFit = fitTypeToCssValue(type)
        }

        return this
    }

    getBody() {
        var vNode = super.getBody()
        vNode.tag = "img"
        vNode.attributes.src = this.url
        vNode.attributes.alt = this.altText

        return vNode
    }
}
