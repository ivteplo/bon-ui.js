//
// Reconciler.js
// Created on 11/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

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
        window.requestIdleCallback = function requestIdleCallback (work, { timeout }) {
            work({
                didTimeout: true,
                timeRemaining: () => 0
            })
        }
    }

    window.requestIdleCallback(performWork, { timeout: 500 })
}

export class Reconciler {
    static addUnitOfWork (func) {
        if (typeof func === "function") {
            workQueue.push(func)
            requestDoingWork()
        }
    }
}
