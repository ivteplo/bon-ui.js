//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { InvalidValueException, ViewControllerException } from "../Values/Exceptions.js"
import { getClass } from "../Values/Helpers.js"
import { ViewBuilder } from "./ViewBuilder.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { View } from "../Views/View.js"

export class ViewController {
    constructor (view) {
        if (!(view instanceof View)) {
            throw new InvalidValueException(`Expected view, got ${getClass(view)}`)
        }

        this.view = view
        this.view.controller = this
        /**
         * @type {VNode}
         */
        this.lastViewRender = null
    }

    loadView ({ to: parent = document.body } = {}) {
        if (this.lastViewRender instanceof VNode) {
            throw new ViewControllerException(`View ${this.view.constructor.name} is already mounted`)
        }

        this.buildView()
        this.lastViewRender.toDomNode({ save: true })
        parent.appendChild(this.lastViewRender.dom)
    }

    buildView (options = {}) {
        ViewBuilder.build(this.view, options)
    }

    updateView () {
        if (!(this.lastViewRender instanceof VNode)) {
            throw new ViewControllerException(`View ${this.view.constructor.name} is not mounted`)
        }

        const { lastViewRender } = this
        this.buildView({ action: "update" })
        this.lastViewRender.updateDomNode(lastViewRender, lastViewRender.dom)
    }

    viewWillAppear () {}

    viewDidAppear () {}

    viewWillUpdate () {}

    viewDidUpdate () {}

    viewWillDisappear () {}

    viewDidDisappear () {}
}
