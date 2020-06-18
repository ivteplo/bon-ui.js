//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Protocol } from "../Values/Protocol.js"

const VNodeProtocol = Protocol.createClass({
    requiredMethods: [ "toString", "toDomNode", "updateDomNode" ]
})

export class VNode extends VNodeProtocol {
    constructor () {
        super()
        this.dom = null
    }
}
