//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { getClass } from "../Values/Helpers.js"
import { View } from "./View.js"

/**
 * Class that contains methods to build the view
 * @class
 * @category Views
 * @subcategory Management
 */
export class ViewBuilder {
    /**
     * Method to build a view
     * @param {View}    view                view to build
     * @param {*}       [options]
     * @param {boolean} [options.save]      save view renderer or not
     * @param {View?}   [options.parentView]
     * @returns {VNode}
     */
    static build (view, { save = true, parentView = null } = {}) {
        if (view instanceof VNode) {
            for (let i in view.body) {
                if (view.body[i] instanceof VNode || view.body[i] instanceof View) {
                    view.body[i] = this.build(view.body[i], { save, parentView })
                }
            }

            return view
        }

        if (!(view instanceof View)) {
            throw new InvalidValueException(`Expected View instance, got ${getClass(view)}`)
        }

        if (parentView instanceof View && !(view.parent instanceof View)) {
            view.parent = parentView
        }

        var result = this.build(view.body, { save, parentView: view })
        result.views.unshift(view)

        for (let modifier of view._vNodeModifiers) {
            result = modifier.body(result)
        }

        if (save) {
            view.controller.vNode = result
        }

        return result
    }
}
