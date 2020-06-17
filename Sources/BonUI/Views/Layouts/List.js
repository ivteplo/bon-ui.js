//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { VStack } from "./VStack.js"
import { Colors } from "../../Values/Color.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { OutlineStyle } from "../../Values/OutlineStyle.js"

/**
 * A class that represents the list
 * @class
 * @extends VStack
 */
export class List extends View {
    /**
     * @param {Array}       data        array of items 
     * @param {Function}    childGetter getter for item view that accepts item of `data` array
     */
    constructor (data, childGetter) {
        super({ data, childGetter })

        if (!Array.isArray(data)) {
            throw new Error("Expected an array, got " + typeof data)
        }

        if (!(childGetter instanceof Function)) {
            throw new Error("Expected a function, got " + typeof childGetter)
        }
    }

    body () {
        const result = (
            new VStack([
                this.options.data.map((item, index) => {
                    const child = this.options.childGetter(item, index)

                    if (child == null) {
                        return null
                    }
                    
                    return (
                        new VNode({
                            tag: "div",
                            body: [ child ],
                            styles: {
                                borderBottom: "1px solid " + Colors.theme.separator
                            }
                        })
                    )
                })
            ])
            .applyCSS(this._styles)
            .setAttributes(this._attributes)
        )

        for (let i in this._handlers) {
            for (let j in this._handlers[i]) {
                result.handle(i, this._handlers[i][j])
            }
        }

        return result
    }
}
