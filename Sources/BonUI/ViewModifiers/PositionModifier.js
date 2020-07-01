//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { ViewVNodeModifier } from "./ViewVNodeModifier.js"
import { Position } from "../Values/Position.js"
import { CSSModifier } from "./CSSModifier.js"

export class PositionModifier extends CSSModifier {
    /**
     * 
     * @param {Symbol} position item of `Position` enum
     */
    constructor (position) {
        if (!Position.contains(position)) {
            throw new InvalidValueException(`Expected Position enum item as the position property`)
        }

        super({
            position: Position.getIdentifier(position)
        })
    }
}
