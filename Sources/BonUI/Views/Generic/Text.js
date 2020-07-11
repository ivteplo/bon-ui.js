//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { FontModifier } from "../../Modifiers/FontModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { TextStyle } from "../../Values/Font.js"
import { View } from "../View.js"

/**
 * Class that represents text.
 * @example
 * new Text("Hello world!")
 * @category Views 
 * @subcategory Generic
 */
export class Text extends View {
    /**
     * @param {string} text
     */
    constructor (text) {
        super()
        this.text = text
    }

    get body () {
        var component = "p"
        const styles = {}

        for (let modifier of this._vNodeModifiers) {
            if (modifier instanceof FontModifier) {
                switch (style) {
                    case TextStyle.default:
                        component = "p"
                    case TextStyle.largeTitle:
                        component = "h1"
                    case TextStyle.title:
                        component = "h2"
                    case TextStyle.subheading:
                        component = "h3"
                    case TextStyle.sectionTitle:
                        component = "h4"
                    case TextStyle.caption:
                        component = "caption"
                    case TextStyle.monospace:
                        component = "code"
                    default:
                        component = TextStyle.getIdentifier(style)
                }

                if (modifier.font.textStyle !== TextStyle.default) {
                    styles.width = "100%"
                }
            }
        }

        return new VNode(component, {
            body: [ this.text ],
            styles
        })
    }

    // /**
    //  * Method to set text alignment
    //  * @param {Symbol} alignment `Alignment` enum item
    //  */
    // alignment (alignment) {
    //     return this.modifier(new TextAlignmentModifier(alignment))
    // }
}

