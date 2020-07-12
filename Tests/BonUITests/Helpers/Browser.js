//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import jsdom from "jsdom"

export function setupBrowserEnvironment () {
    const { JSDOM } = jsdom
    const dom = new JSDOM(``)
    const ignore = [
        "localStorage",
        "sessionStorage",
        "mediaStorage"
    ]

    Object.getOwnPropertyNames(dom.window)
        .filter(prop => ignore.indexOf(prop) === -1)
        .forEach(prop => {
            if (prop in global) {
                return
            }
            
            Object.defineProperty(global, prop, {
                configurable: true,
                get: () => dom.window[prop]
            })
        })
}
