//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
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
        super.handleMount()
    }

    /**
     * @todo clear canvas for other contexts
     */
    handleInvalidation() {
        var context = this.lastVNode.dom.getContext(this.renderingContext)
        
        if (context instanceof CanvasRenderingContext2D) {
            context.clearRect(0, 0, this.lastVNode.dom.width, this.lastVNode.dom.height)
        }

        if (this._handlers.paint) {
            for (let i in this._handlers) {
                this._handlers[i](context, this.lastVNode.dom, this)
            }
        }

        super.handleInvalidation()
    }

    body () {
        var vNode = super.body()
        vNode.tag = "canvas"
        
        return vNode
    }
}
