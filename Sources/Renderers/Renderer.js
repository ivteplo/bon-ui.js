//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Protocol } from "../BonUI/Values/Protocol.js"
import { VNode } from "../VirtualDOM/VNode.js"

const RendererProtocol = Protocol.createClass({
    requiredStaticMethods: [ "render", "update", "mount" ]
})

export class Renderer extends RendererProtocol {
    static prepare (application) {}

    /**
     * 
     * @param {VNode} vNode 
     */
    static render (vNode) {
        RendererProtocol.render()
    }

    /**
     * 
     * @param {VNode} newNode 
     * @param {VNode} oldNode 
     * @param {Node}  dom 
     */
    static update (newNode, oldNode, dom) {
        RendererProtocol.update()
    }

    /**
     * 
     * @param {VNode} vNode 
     * @param {Node}  container 
     */
    static mount (vNode, container) {
        RendererProtocol.mount()
    }
}
