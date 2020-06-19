//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { Alignment } from "../../Values/Alignment.js"
import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"

/**
 * A class that is used to create rows
 */
export class Row extends View {
    /**
     * @param {(View|VNode)[]|View|VNode|function} children             child or children or getter
     * @param {*}                                  [options]
     * @param {Symbol}                             [options.alignment]  alignment type (item of Alignment enum)
     */
    constructor (children, { alignment } = {}) {
        super()
        this.children = children
        this.alignment = Alignment.contains(alignment) ? alignment : Alignment.center
    }

    body () {
        const styles = {
            display: "flex",
            flexDirection: "row"
        }

        switch (this.alignment) {
            case Alignment.start:
                styles.alignItems = "flex-start"
                break
            case Alignment.center:
                styles.alignItems = "center"
                break
            case Alignment.end:
                styles.alignItems = "flex-end"
                break
        }

        return (
            new ContainerVNode({
                component: "div",
                body: this.children,
                styles
            })
        )
    }
}
