//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Protocol } from "../Values/Protocol.js"

/** @todo think about how view modifiers will work */

const ViewModifierProtocol = Protocol.createClass({
    requiredMethods: [ "body" ]
})

export class ViewModifier extends ViewModifierProtocol {
    
}
