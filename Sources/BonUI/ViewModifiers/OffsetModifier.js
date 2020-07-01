//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { Length, pixels } from "../Values/Length.js"
import { CSSModifier } from "./CSSModifier.js"

export class OffsetModifier extends CSSModifier {
    /**
     * 
     * @param {*} options
     * @param {Length|number} [options.x] x offset
     * @param {Length|number} [options.y] y offset
     */
    constructor ({ x, y } = {}) {
        const styles = {}

        if (x !== undefined && x !== null) {
            if (!(typeof x === "number" || x instanceof Length)) {
                throw new InvalidValueException(`Expected number or Length instance as the x offset value`)
            }
        
            styles.left = (x instanceof Length ? x : pixels(x)).toString()
        }

        if (y !== undefined && y !== null) {
            if (!(typeof y === "number" || y instanceof Length)) {
                throw new InvalidValueException(`Expected number or Length instance as the y offset value`)
            }

            styles.top = (y instanceof Length ? y : pixels(y)).toString()
        }

        super(styles)
    }
}
