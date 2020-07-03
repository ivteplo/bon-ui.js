//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { textStyleToTagName, TextStyle } from "../../Values/Font.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

/**
 * Class that represents text
 */
export class Text extends View {
    /**
     * @param {string} text
     */
    constructor (text) {
        super()
        this.text = text
    }

    body () {
        var component = "p"
        const styles = {}

        // for (let modifier of this._vNodeModifiers) {
        //     if (modifier instanceof FontModifier) {
        //         component = textStyleToTagName(modifier.font.textStyle)

        //         if (modifier.font.textStyle !== TextStyle.default) {
        //             styles.width = "100%"
        //         }
        //     }
        // }

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

