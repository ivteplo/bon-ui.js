//
// Canvas.js
// Created on 11/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"

/**
 * @public @class
 * @extends View
 */
export class Canvas extends View {
    /**
     * @todo support different rendering contexts
     */
    constructor () {
        super()
        this.paintHandler = () => {}
    }

    handleMount() {
        this.paintHandler(this.lastVNode.dom.getContext("2d"), this.lastVNode.dom, this)
    }

    handleInvalidation() {
        var context = this.lastVNode.dom.getContext("2d")
        context.clearRect(0, 0, this.lastVNode.dom.width, this.lastVNode.dom.height)
        this.paintHandler(context, this.lastVNode.dom, this)
    }

    setPaintHandler(handler) {
        this.paintHandler = typeof handler === "function" ? handler : () => {}
        return this
    }

    getBody () {
        var vNode = super.getBody()
        vNode.tag = "canvas"
        
        return vNode
    }
}
