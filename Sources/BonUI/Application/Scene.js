//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException, SceneNotLoadedException } from "../Values/Exceptions.js"
import { getClass, convertToViewBodyItem } from "../Values/Helpers.js"
import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { ViewBuilder } from "./ViewBuilder.js"
import { View } from "../Views/View.js"
import "../jsdoc.js"

export class Scene {
    /**
     * 
     * @param {string} name scene name
     * @param {View}   view scene contents
     */
    constructor (name, view) {
        this.name = String(name)
        this.dom = null

        this.view = convertToViewBodyItem(view)
        if (!(this.view instanceof View)) {
            throw new InvalidValueException(`Expected only view in a scene body, got ${getClass(this.view)}`)
        }
    }

    /**
     * Method to load the scene
     * @param {Node} parent parent of the scene
     */
    load (parent = document.body) {        
        const wrapper = this.toVirtualDOMNode()

        wrapper.toDomNode({ save: true })
        parent.appendChild(wrapper.dom)

        this.dom = wrapper.dom
    }

    /**
     * Method to convert scene to virtual DOM node
     */
    toVirtualDOMNode () {
        var bodyVNode = ViewBuilder.build(this.view, { save: true })

        const wrapper = new ContainerVNode({
            component: "div",
            attributes: {
                id: `${this.name}-scene`,
                class: "application-scene"
            },
            styles: {
                backgroundColor: "inherit",
                height: "100vh",
                overflow: "auto"
            },
            body: [
                bodyVNode
            ]
        })

        return wrapper
    }

    /**
     * Method to update the view
     */
    updateView () {
        if (!(this.dom && this.dom instanceof Node)) {
            throw new SceneNotLoadedException(`Scene "${this.name}" is not loaded`)
        }

        this.view.update()
    }

    /**
     * Method to reload the scene
     * @param {Node} parent parent of the scene
     */
    reload (parent) {
        this.close()
        this.load(parent)
    }

    /**
     * Method to close the scene
     */
    close () {
        if (!(this.dom && this.dom instanceof Node)) {
            throw new SceneNotLoadedException(`Scene "${this.name}" is not loaded`)
        }

        /** @todo add view controller handlers calls */
        this.dom.parentNode.removeChild(this.dom)
        this.dom = null
    }
}
