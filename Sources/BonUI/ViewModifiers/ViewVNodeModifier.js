//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ViewModifier } from "./ViewModifier.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { View } from "../Views/View.js"

export class ViewVNodeModifier extends ViewModifier {
    /**
     * Method that returns modified virtual DOM node of the view
     * @param   {VNode} content     virtual DOM node of the view that has to be modified
     * @param   {View}  view        view that gets modified
     * @returns {VNode} modified    virtual DOM node
     */
    // eslint-disable-next-line no-unused-vars
    body (content, view) {
        return super.body(content)
    }
}
