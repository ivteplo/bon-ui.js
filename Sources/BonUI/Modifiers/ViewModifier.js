//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Protocol } from "../Values/Protocol.js"

const ViewModifierProtocol = Protocol.createClass({
    requiredMethods: [ "body" ]
})

export class ViewModifier extends ViewModifierProtocol {
    /**
     * Method that returns the modified view
     * @param   {View} content view to modify
     * @returns {View} modified view
     */
    body (content) {
        return super.body(content)
    }
}
