//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { CSSModifier } from "../../Modifiers/CSSModifier.js"
import { Rectangle } from "../Shapes/Rectangle.js"
import { Color } from "../../Values/Color.js"
import { View } from "../View.js"

/**
 * View that represents the divider of the sections etc.
 * @example
 * new Column([
 *     new Text("Title")
 *         .font(Font.largeTitle),
 *     new Divider(),
 *     new Text("Description")
 * ])
 * @category Views 
 * @subcategory Generic
 */
export class Divider extends View {
    get body () {
        const rectangle = (
            new Rectangle()
                .foregroundColor(Color.secondary)
        )

        rectangle.modifier(new CSSModifier({
            flexBasis: "1px",
            alignSelf: "stretch",
            flexShrink: "0",
            overflow: "hidden"
        }))

        return rectangle
    }
}
