//
// Link.js
// Created on 28/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { VNode } from "../../VirtualDOM/VNode"

/**
 * A view that represents the link
 * @class
 * @extends View
 */
export class Link extends View {
    /**
     * @param {Object}      options
     * @param {String}      options.url      The URL of the link
     * @param {View|VNode}  options.label    The label of the link
     */
    constructor ({ url, label }) {
        super()
        this.label = label
        this.attributes.href = url || "javascript:void(0)"
        this.styles.textDecoration = "none"
        this.styles.display = "inline-block"
    }

    getBody () {
        var vNode = super.getBody()
        vNode.tag = "a"
        vNode.body = [ this.label ]
        
        return vNode
    }
}
