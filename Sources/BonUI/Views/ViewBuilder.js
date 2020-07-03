//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { getClass } from "../Values/Helpers.js"
import { View } from "./View.js"

/**
 * Class that contains methods to build the view
 * @class
 */
export class ViewBuilder {
    /**
     * Method to build a view
     * @param {View}    view                view to build
     * @param {*}       [options]
     * @param {boolean} [options.save]      save view renderer or not
     * @returns {VNode}
     */
    static build (view, { save = true } = {}) {
        if (!(view instanceof View)) {
            throw new InvalidValueException(`Expected View instance, got ${getClass(view)}`)
        }

        var result = view.body()

        if (result instanceof View) {
            result.parent = view
        }
        
        if (!(result instanceof VNode)) {
            result = this.build(result, { save })
        }

        for (let i in result.body) {
            if (result.body[i] instanceof View) {
                result.body[i] = this.build(result.body[i], { save })
            }
        }

        for (let modifier of view._vNodeModifiers) {
            result = modifier.body(result)
        }

        if (save) {
            view.controller.vNode = result
        }

        return result
    }
}
