//
// List.js
// Created on 28/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"
import { VStack } from "./VStack"
import { VNode } from "../../VirtualDOM/VNode"

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
        this.setListStyleType("disk")
    }

    /**
     * A method to set the type of the list style
     * @param {String} type 
     * @todo create an enum for list style types, add images support
     */
    setListStyleType (type) {
        if (typeof type === "string" || type instanceof String) {
            this.styles.listStyleType = type
        }
    }

    getBody () {
        var vNode = super.getBody()
        vNode.tag = "ul"
        
        for (let i = 0; i < vNode.body.length; ++i) {
            vNode.body[i] = new VNode({
                tag: "li",
                body: [ vNode.body[i] ]
            })
        }
        
        return vNode
    }
}
