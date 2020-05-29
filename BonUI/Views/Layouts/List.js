//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { VStack } from "./VStack.js"
import { VNode } from "../../VirtualDOM/VNode.js"

/**
 * A class that represents the list
 * @class
 * @extends VStack
 */
export class List extends VStack {
    /**
     * @param {Array<View|VNode>} children The items of the list
     */
    constructor (...args) {
        super(...args)
        this.listStyle({ type: "disk" })
    }

    /**
     * A method to set the list style
     * @param {String} type 
     * @todo create an enum for list style types, add images support
     */
    listStyle ({ type }) {
        if (typeof type === "string" || type instanceof String) {
            this._styles.listStyleType = type
        }
    }

    body () {
        var vNode = super.body()
        vNode.tag = "ul"

        for (let i = 0; i < vNode.body.length; ++i) {
            vNode.body[i] = new VNode({
                tag: "li",
                body: [ vNode.body[i] ],
                view: vNode.body[i]
            })
        }
        
        return vNode
    }
}
