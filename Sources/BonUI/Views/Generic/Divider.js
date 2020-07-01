//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { CSSModifier } from "../../ViewModifiers/CSSModifier.js"
import { Rectangle } from "../Shapes/Rectangle.js"
import { Color } from "../../Values/Color.js"
import { View } from "../View.js"

export class Divider extends View {
    constructor () {
        super()
    }

    body () {
        const rectangle = (
            new Rectangle()
                .foregroundColor(Color.divider)
        )

        rectangle._vNodeModifiers.push(new CSSModifier({
            flexBasis: "1px",
            alignSelf: "stretch",
            flexShrink: "0"
        }))

        return rectangle
    }
}
