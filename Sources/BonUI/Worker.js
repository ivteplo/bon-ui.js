//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "./Values/Exceptions.js"

const workQueue = []

function performWork (deadline) {
    while (workQueue.length > 0 && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
        (workQueue.shift())()
    }

    if (workQueue.length > 0) {
        requestDoingWork()
    }
}

function requestDoingWork () {
    if (!("requestIdleCallback" in window && typeof window.requestIdleCallback === "function")) {
        // eslint-disable-next-line no-unused-vars
        window.requestIdleCallback = function requestIdleCallback (work, { timeout } = {}) {
            work({
                didTimeout: true,
                timeRemaining: () => 0
            })
        }
    }

    window.requestIdleCallback(performWork, { timeout: 500 })
}

/**
 * A class that is used to schedule work 
 * @class
 */
export class Worker {
    /**
     * A method to schedule a call of the function
     * @param {Function} func Function that will be called when the browser is not busy
     */
    static addUnitOfWork (func) {
        if (typeof func !== "function") {
            throw new InvalidValueException(`Expected function to call, got ${typeof func}`)
        }

        workQueue.push(func)
        requestDoingWork()
    }
}
