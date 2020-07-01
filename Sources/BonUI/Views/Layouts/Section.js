//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

// importing modifiers
import { PaddingModifier } from "../../ViewModifiers/PaddingModifier.js"
import { FontModifier } from "../../ViewModifiers/FontModifier.js"
import { CSSModifier } from "../../ViewModifiers/CSSModifier.js"

import { InvalidValueException } from "../../Values/Exceptions.js"
import { VerticalAlignment } from "../../Values/Alignment.js"
import { getClass } from "../../Values/Helpers.js"
import { Divider } from "../Generic/Divider.js"
import { Font } from "../../Values/Font.js"
import { Column } from "./Column.js"
import { View } from "../View.js"

export class Section extends View {
    constructor (title, body) {
        super()
        
        if (!(title instanceof View)) {
            throw new InvalidValueException(`Expected View as a title, got ${getClass(title)}`)
        }

        this.title = title
        this.title._vNodeModifiers.unshift(
            new FontModifier(Font.sectionTitle),
            new PaddingModifier(),
            new CSSModifier({
                textTransform: "uppercase"
            })
        )

        this.items = body
    }

    body () {
        return (
            new Column([
                this.title,

                new Divider(),

                new Column(this.items, { alignment: VerticalAlignment.topLeading })
                    .padding()
            ], { alignment: VerticalAlignment.topLeading, spacing: 0 })
        )
    }
}
