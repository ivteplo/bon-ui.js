//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { TextVNode } from "../../VirtualDOM/TextVNode.js"
import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"

/**
 * A class that is used to represent the text
 */
export class Text extends View {
    /**
     * @param {string} text
     */
    constructor (text) {
        super()
        this.text = text
    }

    body () {
        return (
            new ContainerVNode({
                component: "span",
                body: new TextVNode(this.text),
                styles: {
                    userSelect: "none"
                }
            })
        )
    }
}

