//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

export class Spacer extends View {
    body () {
        /** @todo improve */
        var hasSizeModifier = false

        // for (let modifier of this._vNodeModifiers) {
        //     if (modifier instanceof SizeModifier && (modifier.cssStyles.width || modifier.cssStyles.height)) {
        //         hasSizeModifier = true
        //         break
        //     }
        // }

        const styles = {
            flexShrink: "0"
        }

        if (!hasSizeModifier) {
            styles.flexGrow = "1"
        }

        return new VNode("div", {
            styles
        })
    }
}
