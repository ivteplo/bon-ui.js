//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

export class Event {
    /**
     * @param {String} type event type
     * @param {Object} info event info
     */
    constructor (type, info = {}) {
        this.type = String(type)
        this.info = typeof info === "object" ? info : {}
    }
}

