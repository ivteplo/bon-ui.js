//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VNode } from "../../VirtualDOM/VNode.js"
import { ViewModifier } from "./ViewModifier.js"

/**
 * Modifier for view's virtual DOM node
 * @interface
 * @category Modifiers
 */
export class ViewVNodeModifier extends ViewModifier {
    /**
     * 
     * @param {VNode} content 
     */
    body (content) {
        super.body(content)
    }
}
