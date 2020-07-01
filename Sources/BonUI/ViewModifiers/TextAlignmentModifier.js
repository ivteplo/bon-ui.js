//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { alignmentToTextAlignmentProperties } from "../Values/Helpers.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { Alignment } from "../Values/Alignment.js"
import { CSSModifier } from "./CSSModifier.js"

export class TextAlignmentModifier extends CSSModifier {
    /**
     * @param {Symbol} alignment text aligment
     */
    constructor (alignment) {
        if (!Alignment.contains(alignment)) {
            throw new InvalidValueException(`Expected Alignment enum item as the alignment value`)
        }

        super(alignmentToTextAlignmentProperties(alignment))
    }
}
