//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../Views/View.js"
import { ApplicationDelegate } from "./ApplicationDelegate.js"
import { InvalidValueException } from "../Values/Exceptions.js"

/**
 * 
 * @param {View}    view                view to mount
 * @param {Node}    parent              parent 
 * @param {*}       param2              optional parameters
 * @param {Boolean} [param2.prepend]    prepend or append child to the parent
 */
function mountView (view, parent, { prepend = false } = {}) {
    View.renderToVirtualDomNode(view, { save: true })
    view.lastRender.toDomNode({ save: true })

    if (prepend) {
        parent.prepend(view.lastRender.dom)
    } else {
        parent.appendChild(view.lastRender.dom)
    }
}

export class Application {
    constructor () {
        this.view = null
        this.delegate = null
    }

    setView (view) {
        if (!(view instanceof View)) {
            throw new InvalidValueException(`Expected View instance as an argument`)
        }

        this.view = view
    }

    setDelegate (delegate) {
        if (!(delegate instanceof ApplicationDelegate)) {
            throw new InvalidValueException(`Expected ApplicationDelegate instance`)
        }

        this.delegate = delegate
    }

    main ({ serverSideRenderedView = null } = {}) {
        // running delegate's event handler
        if (this.delegate) {
            this.delegate.applicationWillLoad(this)
        }

        // initializing styles
        if (typeof document !== "object") {
            throw new InvalidValueException(`Expected "document" to be object, got ${typeof document}`)
        }

        const styles = document.createElement("style")
        styles.innerHTML = (
            `* {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                overflow: hidden;
                height: 100vh;
                width: 100vw;
                font-family: sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
            }`
        )
        styles.className = "bon-ui-styles"
        document.head.appendChild(styles)

        // mounting the view
        if (this.view) {
            /** @todo server side rendering support */
            mountView(this.view, document.body, { prepend: true })
        }

        // running delegate's event handler
        if (this.delegate) {
            this.delegate.applicationStarted(this)
        }

        // adding event handlers to the window that will call
        // some of the ApplicationDelegate methods

        var hidden, visibilityChange
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden"
            visibilityChange = "visibilitychange"
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden"
            visibilityChange = "msvisibilitychange"
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden"
            visibilityChange = "webkitvisibilitychange"
        }

        if (this.delegate) {
            document.addEventListener(visibilityChange, () => {
                if (document[hidden]) {
                    this.delegate.applicationLostFocus(this)
                } else {
                    this.delegate.applicationGotFocus(this)
                }
            })

            window.addEventListener("beforeunload", event => {
                const returnValue = this.delegate.applicationWillClose(this)
                event.returnValue = returnValue || ""
                return returnValue
            })

            window.addEventListener("unload", event => {
                this.delegate.applicationIsClosing(this)
            })
        }
    }
}
