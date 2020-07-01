//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { CSSModifier } from "./CSSModifier.js"
import { Color } from "../Values/Color.js"

export class ForegroundColorModifier extends CSSModifier {
    /**
     * @param {Color} color color to set
     */
    constructor (color) {
        
        if (!(color instanceof Color)) {
            throw new InvalidValueException(`Expected Color instance as the color parameter`)
        }
        
        super({ color })
    }
}
