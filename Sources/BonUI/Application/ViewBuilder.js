//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { getClass } from "../Values/Helpers.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { View } from "../Views/View.js"

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
        } else if (result instanceof VNode) {
            result.parentView = view
        }
        
        if (!(result instanceof VNode)) {
            result = ViewBuilder.build(result, { save })
        }

        for (let modifier of view._vNodeModifiers) {
            result = modifier.body(result, view)
        }

        if (save) {
            view.controller.lastViewRender = result
        }

        result
            .onBeforeMount(() => {
                view.controller.viewWillAppear()
            })
            .onMount(() => {
                view.controller.viewDidAppear()
            })
            .onBeforeUpdate(() => {
                view.controller.viewWillUpdate()
            })
            .onUpdate(() => {
                view.controller.viewDidUpdate()
            })
            .onBeforeUnmount(() => {
                view.controller.viewWillDisappear()
            })
            .onUnmount(() => {
                view.controller.viewDidDisappear()
            })

        return result
    }
}
