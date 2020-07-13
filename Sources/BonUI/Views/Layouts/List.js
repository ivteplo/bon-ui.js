//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { getClass, convertToViewBody } from "../../Values/Helpers.js"
import { HorizontalAlignment } from "../../Values/Enums/Alignment.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { Divider } from "../Generic/Divider.js"
import { Column } from "./Column.js"
import { View } from "../View.js"
import "../../jsdoc.js"

/**
 * View that represents list of items
 * @category Views
 * @subcategory Layouts
 * @example
 * new List([ 1, 2, 3 ], num => (
 *     new Row([ 
 *         new Text("Number" + num),
 *         new Spacer()
 *     ])
 * ))
 */
export class List extends View {
    /**
     * 
     * @param {Array|BodyItems} dataOrChildren data or children
     * @param {BodyItemGetter?} children child getter
     */
    constructor (dataOrChildren, children) {
        super()

        if (dataOrChildren && children) {
            this.data = dataOrChildren
            this.children = children

            if (!Array.isArray(this.data)) {
                throw new InvalidValueException(`Expected data to be an array, got ${getClass(data)}`)
            }
        } else {
            this.children = dataOrChildren
        }
    }

    get body () {
        const { children } = this
        var body = []

        if (this.data && typeof children === "function") {
            for (let item of this.data) {
                body.push(children(item), new Divider())
            }
        } else {
            body = convertToViewBody(children).map(item => [ item, new Divider() ])
        }

        return new Column(body, { alignment: HorizontalAlignment.leading })
    }
}
