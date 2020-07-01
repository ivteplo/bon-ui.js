//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { View } from "../View.js"
import { SizeModifier } from "../../ViewModifiers/SizeModifier.js"

export class Spacer extends View {
    body () {
        var hasSizeModifier = false
        for (let modifier of this._vNodeModifiers) {
            if (modifier instanceof SizeModifier && (modifier.cssStyles.width || modifier.cssStyles.height)) {
                hasSizeModifier = true
                break
            }
        }

        const styles = {
            flexShrink: "0"
        }

        if (!hasSizeModifier) {
            styles.flexGrow = "1"
        }

        return new ContainerVNode({
            component: "div",
            styles
        })
    }
}
