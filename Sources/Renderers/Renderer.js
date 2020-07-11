//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Protocol } from "../BonUI/Values/Protocol.js"
import { VNode } from "../VirtualDOM/VNode.js"

const RendererProtocol = Protocol.createClass({
    requiredStaticMethods: [ "render", "update", "mount", "setWindowTitle" ]
})

export class Renderer extends RendererProtocol {
    /**
     * Method to prepare the app for launching
     */
    static prepare () {}

    /**
     * Method to render the virtual DOM node
     * @param {VNode} vNode 
     */
    static render (vNode) {
        RendererProtocol.render()
    }

    /**
     * Method to update the virtual DOM node
     * @param {VNode} newNode 
     * @param {VNode} oldNode 
     * @param {*}     builtNode 
     */
    static update (newNode, oldNode, builtNode) {
        RendererProtocol.update()
    }

    /**
     * Method to mount the virtual DOM node to specific container
     * @param {VNode} vNode 
     * @param {*}     container 
     */
    static mount (vNode, container) {
        RendererProtocol.mount()
    }

    /**
     * Method to set the title of the app window
     * @param {string} title title to set
     */
    static setWindowTitle (title) {
        RendererProtocol.setWindowTitle()
    }
}
