//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { getClass } from "../Values/Helpers.js"
import { View } from "../Views/View.js"
import "../jsdoc.js"

/**
 * Class that represents the scene
 * @category Application lifecycle
 * @subcategory Scenes
 */
export class Scene {
    /**
     * 
     * @param {string} name scene name
     * @param {View}   view scene contents
     */
    constructor (name, view) {
        if (!(view instanceof View)) {
            throw new InvalidValueException(`Expected view as the scene body, got ${getClass(view)}`)
        }
        
        this.name = String(name)
        this.view = view
        this.vNode = null

        this.view.onDidUpdate(() => {
            this.vNode.body = this.view.controller.vNode
        })
    }
}
