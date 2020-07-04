//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { SizeModifier } from "../../Modifiers/SizeModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

export class Spacer extends View {
    body () {
        return new VNode("div", {
            styles: {
                flexShrink: "0",
                flexGrow: this.hasVNodeModifier(SizeModifier) ? "0" : "1"
            }
        })
    }
}
