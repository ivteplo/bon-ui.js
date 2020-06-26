//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { flattenArray } from "../Values/Array.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { ViewBuilder } from "./ViewBuilder.js"
import { View } from "../Views/View.js"

export class Scene {
    /**
     * @typedef {function|(View|VNode)[]|(View|VNode)} Body
     * @param {string}  name scene name
     * @param {Body}    body scene contents
     */
    constructor (name, body) {
        this.name = String(name)
        this.children = body
    }

    body () {
        var body = this.children

        if (typeof body === "function") {
            body = body()
        }

        if (!Array.isArray(body)) {
            body = [ body ]
        }

        body = flattenArray(body).filter(n => Boolean(n))
        return body
    }

    load (parent = document.body) {
        const body = this.body()
        const vNodeBody = []

        for (let i in body) {
            if (!(body[i] instanceof View)) {
                throw new InvalidValueException(`Expected only views in a scene body, got ${
                    typeof body[i] === "object" ? body[i].constructor.name : typeof body[i]}`)
            }

            vNodeBody.push(ViewBuilder.build(body[i]))
        }

        const wrapper = new ContainerVNode({
            component: "div",
            attributes: {
                id: `scene-${this.name}`
            },
            styles: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%"
            },
            body: vNodeBody
        })

        wrapper.toDomNode({ save: true })
        parent.appendChild(wrapper.dom)
    }
}
