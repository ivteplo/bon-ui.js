//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { NotImplementedException } from "./Exceptions.js"

/**
 * Class that is used to work with protocols (interfaces)
 * @class
 * @ignore
 */
export class Protocol {
    /**
     * Method to create protocol (interface)
     * @param   {*}        options
     * @param   {Function} [options.inherit]                class to inherit
     * @param   {String[]} [options.requiredMethods]        methods that have to be implemented
     * @param   {String[]} [options.requiredStaticMethods]  static methods that have to be implemented
     * @returns {Function}
     */
    static createClass ({ inherit = null, requiredMethods = [], requiredStaticMethods = [] } = {}) {
        var ResultClass
        if (inherit !== null) {
            ResultClass = class extends inherit {}
        } else {
            ResultClass = class {}
        }
        
        for (let method of requiredMethods) {
            ResultClass.prototype[method] = function () {
                throw new NotImplementedException(`Method "${this.constructor.name}#${method}" is not implemented`)
            }
        }

        for (let method of requiredStaticMethods) {
            ResultClass[method] = function () {
                throw new NotImplementedException(`Method "${this.constructor.name}.${method}" is not implemented`)
            }
        }

        return ResultClass
    }
}
