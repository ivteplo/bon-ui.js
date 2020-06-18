//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { NotImplementedException } from "./Exceptions.js"

export class Protocol {
    static createClass ({ inherit = null, requiredMethods = [] } = {}) {
        var ResultClass
        if (inherit !== null) {
            ResultClass = class extends inherit {}
        } else {
            ResultClass = class {}
        }
        
        for (let method of requiredMethods) {
            ResultClass.prototype[method] = function () {
                throw new NotImplementedException(`Method "${method}" is not implemented`)
            }
        }

        return ResultClass
    }
}
