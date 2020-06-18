//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VNode } from "./VNode.js"

export class TextVNode extends VNode {
    constructor (text) {
        super()
        this.text = text
    }

    toString () {
        return String(this.text instanceof Function ? this.text() : this.text)
    }

    toDomNode ({ save = false } = {}) {
        if (typeof document !== "object") {
            throw new InvalidValueException(`Expected "document" to be object, got ${typeof document}`)
        }

        const result = document.createTextNode(this.toString())

        if (save) {
            this.dom = result
        }

        return result
    }

    updateDomNode (oldNode, dom) {
        if (oldNode instanceof TextVNode) {
            dom.textContent = this.text
        } else {
            const newDom = this.toDomNode({ save: true })
            dom.replaceWith(newDom)
        }
    }
}
