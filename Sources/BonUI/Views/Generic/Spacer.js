//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { SizeModifier } from "../../Modifiers/SizeModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

export class Spacer extends View {
    body () {
        const styles = {
            flexShrink: "0"
        }

        if (!this.hasVNodeModifier(SizeModifier)) {
            styles.flexGrow = "1"
        }

        return new VNode("div", { styles })
    }
}
