//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

export class ClickInfo {
    constructor ({ x, y, clientX, clientY, shiftKey, altKey } = {}) {
        this.x = x
        this.y = y

        this.clientX = clientX
        this.clientY = clientY

        this.shiftKey = shiftKey
        this.altKey = altKey
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    static fromMouseEvent (event) {
        return new ClickInfo({
            ...event
        })
    }
}
