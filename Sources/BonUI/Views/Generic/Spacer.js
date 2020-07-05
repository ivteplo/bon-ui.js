//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { SizeModifier } from "../../Modifiers/SizeModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

export class Spacer extends View {
    get body () {
        const styles = {}

        if (!this.hasVNodeModifier(SizeModifier)) {
            styles.flexGrow = "1"
        }

        return new VNode("bon-ui-spacer", { styles })
    }
}
