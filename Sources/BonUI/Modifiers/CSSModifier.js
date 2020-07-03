//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ViewVNodeModifier } from "./ViewVNodeModifier.js"

export class CSSModifier extends ViewVNodeModifier {
    constructor (styles = {}) {
        super()
        this.styles = styles
    }

    body (content) {
        for (let key in this.styles) {
            content.styles[key] = this.styles[key]
        }
        
        return content
    }
}
