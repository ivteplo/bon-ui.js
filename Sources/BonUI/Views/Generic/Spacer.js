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
            // then the spacer has to try to fill the space
            if (this.parent && "containsSpacer" in this.parent) {
                this.parent.containsSpacer = true
            }
        }

        return new VNode("div", {
            styles
        })
    }
}
