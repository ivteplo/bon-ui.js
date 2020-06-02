//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { VNode } from "../../VirtualDOM/VNode.js"

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
        super({ url, label })

        this.applyCSS({
            textDecoration: "none",
            display: "inline-block"
        })

        this.setAttributes({
            href: this.options.label ? this.options.label : "javascript:void(0)"
        })
    }

    body () {
        var vNode = super.body()
        vNode.tag = "a"
        vNode.body = [ this.options.label ]
        
        return vNode
    }
}
