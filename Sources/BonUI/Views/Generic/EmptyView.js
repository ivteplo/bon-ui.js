//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

export class EmptyView extends View {
    body () {
        return new VNode("div")
    }
}
