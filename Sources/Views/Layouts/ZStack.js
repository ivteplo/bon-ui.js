//
// ZStack.js
// Created on 26/02/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { View } from "../View"

/**
 * @public @class
 * @extends View
 */
export class ZStack extends View {
    /**
     * @param {View[]} children 
     */
    constructor (children) {
        super()
        this.children = children
        this.styles.position = "relative"
    }

    getBody () {
        var { children } = this

        if (!Array.isArray(children)) {
            children = children ? [children] : []
        }

        var vNode = super.getBody()
        vNode.tag = "div"
        vNode.body = children.filter(value => value != null)

        for (let i = 0; i < children.length; ++i) {
            children[i].styles.zIndex = i
            
            if (children[i].styles.position == undefined) {
                children[i].styles.position = "relative"
            }
        }
        
        return vNode
    }
}
