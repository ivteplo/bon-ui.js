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

function requestIdleCallback (func, args) {
    if (typeof window === "object" && "requestIdleCallback" in window) {
        return window.requestIdleCallback(func, args)
    } else {
        // eslint-disable-next-line no-unused-vars
        return (work => {
            work({
                didTimeout: true,
                timeRemaining: () => 0
            })
        })(func)
    }
}

function requestDoingWork () {
    requestIdleCallback(performWork, { timeout: 500 })
}

/**
 * Class that is used to schedule work 
 * @class
 */
export class Worker {
    /**
     * Method to schedule a call of the function
     * @param {Function} func function that will be called when the browser is not busy
     */
    static addUnitOfWork (func) {
        if (typeof func !== "function") {
            throw new InvalidValueException(`Expected function to call, got ${typeof func}`)
        }

        workQueue.push(func)
        requestDoingWork()
    }
}
