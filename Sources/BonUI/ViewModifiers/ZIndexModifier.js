//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException } from "../Values/Exceptions.js"
import { CSSModifier } from "./CSSModifier.js"

export class ZIndexModifier extends CSSModifier {
    constructor (zIndex) {
        if (typeof zIndex !== "number") {
            throw new InvalidValueException(`Expected number as the zIndex property, got ${typeof zIndex}`)
        }

        super({ zIndex })
    }
}
