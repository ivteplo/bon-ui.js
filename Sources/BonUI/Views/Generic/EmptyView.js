//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../../VirtualDOM/ContainerVNode.js"
import { View } from "../View.js"

export class EmptyView extends View {
    body () {
        return new ContainerVNode({ component: "div" })
    }
}
