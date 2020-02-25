//
// Text.js
// Created on 08/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { Font, textStyleToTagName, TextStyle } from "../../Values/Font"
import { VNode } from "../../VirtualDOM/VNode"

/**
 * @public @class
 * @extends View
 */
export class Text extends View {
    /**
     * @param {string} text 
     */
    constructor (text) {
        super()
        this.text = text
        this.setSelectableTo(false)
        this.styles.margin = 0
        this.styles.padding = 0
    }

    getBody () {
        var { text, styles, events, attributes } = this
        var tag = "p"

        if (styles.font instanceof Font && TextStyle.contains(styles.font.textStyle)) {
            tag = textStyleToTagName(styles.font.textStyle)
        }

        var body = this.text.split("\n").map(val => {
            return [
                new VNode({
                    text: val
                }),
                new VNode({
                    tag: "br"
                })
            ]
        }).reduce((prev, next) => prev.concat(next)).slice(0, -1)

        var vNode = super.getBody()
        vNode.tag = tag
        vNode.body = body

        return vNode
    }
}
