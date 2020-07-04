//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { Length, pixels } from "../Values/Length.js"
import { Edge } from "../Values/Enums/Edge.js"
import { CSSModifier } from "./CSSModifier.js"

export class PaddingModifier extends CSSModifier {
    /**
     * @param {Length|number}   [padding] padding value
     * @param {Edge}            [edge]    edges for padding
     */
    constructor (padding = Length.defaultPadding, edge = Edge.all) {
        if (!(typeof padding === "number" || padding instanceof Length)) {
            throw new InvalidValueException(`Expected number or Length instance as the padding value`)
        }

        if (!Edge.contains(edge)) {
            throw new InvalidValueException(`Expected Edge enum item as the edge parameter`)
        }

        const _padding = padding instanceof Length ? padding : pixels(padding)

        const styles = {}

        switch (edge) {
            case Edge.top:
                styles.paddingTop = _padding
                break
            case Edge.bottom:
                styles.paddingBottom = _padding
                break
            case Edge.left:
                styles.paddingLeft = padding
                break
            case Edge.right:
                styles.paddingRight = _padding
                break
            case Edge.all:
                styles.padding = _padding
                break
        }

        super(styles)
    }
}
