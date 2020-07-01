//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException, SceneNotLoadedException } from "../Values/Exceptions.js"
import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { getClass } from "../Values/Helpers.js"
import { ViewBuilder } from "./ViewBuilder.js"
import { View } from "../Views/View.js"
import "../jsdoc.js"

export class Scene {
    /**
     * 
     * @param {string}      name scene name
     * @param {BodyOneItem} body scene contents
     */
    constructor (name, body) {
        this.name = String(name)
        this.child = body
        this.dom = null
        this.lastBody = null
    }

    /**
     * Method that returns scene view
     */
    body () {
        var body = this.child

        if (typeof body === "function") {
            body = body()
        }

        if (Array.isArray(body)) {
            if (body.length > 1) {
                throw new InvalidValueException(`Scene can contain only one root view`)
            }

            body = body[0]
        }

        return body
    }

    /**
     * Method to load the scene
     * @param {Node} parent parent of the scene
     */
    load (parent = document.body) {
        const body = this.body()

        if (!(body instanceof View)) {
            throw new InvalidValueException(`Expected only view in a scene body, got ${getClass(body[i])}`)
        }

        var bodyVNode = ViewBuilder.build(body)

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

        wrapper.toDomNode({ save: true })
        parent.appendChild(wrapper.dom)

        this.dom = wrapper.dom
        this.lastBody = body
    }

    /**
     * Method to update last body (view that was rendered last time)
     */
    updateLastBody () {
        if (!(this.dom && this.dom instanceof Node)) {
            throw new SceneNotLoadedException(`Scene "${this.name}" is not loaded`)
        }

        this.lastBody.controller.updateView()
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

        this.dom.parentNode.removeChild(this.dom)
        this.dom = null
        this.lastBody = null
    }
}
