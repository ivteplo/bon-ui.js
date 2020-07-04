//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { Position } from "../Values/Enums/Position.js"
import { CSSModifier } from "./CSSModifier.js"

export class PositionModifier extends CSSModifier {
    /**
     * @param {Length|number} position `Position` enum item
     */
    constructor (position) {
        if (!Position.contains(position)) {
            throw new InvalidValueException(`Expected Position enum item as the position parameter`)
        }

        const styles = {}

        switch (position) {
            default:
                styles.position = Position.getIdentifier(position)
                break
        }

        super(styles)
    }
}
