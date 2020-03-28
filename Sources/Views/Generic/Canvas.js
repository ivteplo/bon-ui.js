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
 * A view that represents the canvas
 * @class
 * @extends View
 */
export class Canvas extends View {
    /**
     * @param {string} renderingContext The type of canvas rendering (2d or webgl or experimental-webgl)
     */
    constructor (renderingContext = "2d") {
        super()
        this.paintHandler = () => {}
        this.renderingContext = renderingContext
    }

    handleMount() {
        this.paintHandler(this.lastVNode.dom.getContext(this.renderingContext), this.lastVNode.dom, this)
    }

    /**
     * @todo clear canvas for other contexts
     */
    handleInvalidation() {
        var context = this.lastVNode.dom.getContext(this.renderingContext)
        
        if (context instanceof CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.lastVNode.dom.width, this.lastVNode.dom.height)
        }

        this.paintHandler(context, this.lastVNode.dom, this)
    }

    /**
     * A method to set the paint handler
     * @param {Function} handler The function that will be called each time canvas redraws everything (passed canvas context, canvas DOM and the view itself)
     */
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
