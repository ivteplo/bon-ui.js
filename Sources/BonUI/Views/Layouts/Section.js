//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { HorizontalAlignment } from "../../Values/Enums/Alignment.js"
import { PaddingModifier } from "../../Modifiers/PaddingModifier.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { FontModifier } from "../../Modifiers/FontModifier.js"
import { CSSModifier } from "../../Modifiers/CSSModifier.js"
import { getClass } from "../../Values/Helpers.js"
import { percents } from "../../Values/Length.js"
import { Divider } from "../Generic/Divider.js"
import { Font } from "../../Values/Font.js"
import { Column } from "./Column.js"
import { View } from "../View.js"
import "../../jsdoc.js"

/**
 * View that represents content section.
 * @example
 * new Section(
 *     new Text("My todos"),
 *     new Column([
 *         // ...
 *     ])
 * )
 * @category Views 
 * @subcategory Layouts
 */
export class Section extends View {
    /**
     * 
     * @param {View} title title of the section
     * @param {Body} body  content of the section
     */
    constructor (title, body) {
        super()
        
        if (!(title instanceof View)) {
            throw new InvalidValueException(`Expected View as a title, got ${getClass(title)}`)
        }

        this.title = (
            title
                .prependVNodeModifier(new FontModifier(Font.sectionTitle))
                .prependVNodeModifier(new PaddingModifier())
                .prependVNodeModifier(new CSSModifier({
                    textTransform: "uppercase"
                }))
        )

        this.items = body
    }

    get body () {
        return (
            new Column([
                this.title,

                new Divider(),

                new Column(this.items || new Spacer(), { alignment: HorizontalAlignment.topLeading })
                    .padding()
            ], { alignment: HorizontalAlignment.leading, spacing: 0 })
                .size({ width: percents(100) })
        )
    }
}
