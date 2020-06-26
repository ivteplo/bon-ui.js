//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { VNode } from "../VirtualDOM/VNode.js"
import { View } from "../Views/View.js"

/**
 * @class
 * Class that contains methods to build the view
 */
export class ViewBuilder {
    /**
     * Method to build a view
     * @param {View}    view                view to build
     * @param {*}       [options]       
     * @param {boolean} [options.action]    `"update"` / `"mount"`
     * @param {boolean} [options.save]      save view renderer or not
     * @returns {VNode}
     */
    static build (view, { action = "mount", save = true } = {}) {
        if (action === "mount") {
            view.controller.viewWillMount()
        } else if (action === "update") {
            view.controller.viewWillUpdate()
        }

        var result = view.body()
        
        if (!(result instanceof VNode)) {
            result = ViewBuilder.build(result, { action, save })
        }

        if (save) {
            view.controller.lastViewRender = result
        }

        if (action === "mount") {
            result.onMount(() => {
                view.controller.viewDidMount()
            })
        } else if (action === "update") {
            result.onUpdate(() => {
                view.controller.viewDidUpdate()
            })
        }

        return result
    }
}
