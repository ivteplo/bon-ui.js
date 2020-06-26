//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { EmptyView } from "../Views/Generic/EmptyView.js"
import { Scene } from "./Scene.js"
import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { TextVNode } from "../VirtualDOM/TextVNode.js"
import { VNode } from "../VirtualDOM/VNode.js"

export class Application {
    body () {
        return [
            new Scene("main", new EmptyView())
        ]
    }

    launch () {
        const container = this.constructor.createApplicationContainer([
            this.constructor.createStylesContainer()
        ])

        container.toDomNode({ save: true })

        const body = this.body()
        var scene = null

        for (let i in body) {
            if (body[i] instanceof Scene && body[i].name === "main") {
                scene = body[i]
                break
            }
        }

        if (scene === null) {
            throw new SceneNotFoundException(`Couldn't find scene "main"`)
        }

        scene.load(container.dom)
        document.body.appendChild(container.dom)
    }

    /**
     * Application main
     */
    static main () {
        const App = this
        const application = new App()
        application.launch()
    }

    /**
     * Default app styles
     */
    static defaultStyles = (
        `* {
            margin: 0;
            padding: 0;
        }
        
        html, body {
            height: 100%;
        }
        
        body {
            font-family: sans-serif;
            font-size: 12pt;
            user-select: none;
        }`
    )

    /**
     * Function that creates container for an app
     * @param {function|VNode[]} body 
     * @returns {ContainerVNode}
     */
    static createApplicationContainer (body = []) {
        return (
            new ContainerVNode({
                component: "div",
                styles: {
                    overflow: "hidden",
                    width: "100%",
                    height: "100%"
                },
                attributes: {
                    id: "application"
                },
                body
            })
        )
    }

    /**
     * Function that returns container for application styles
     * @returns {ContainerVNode}
     */
    static createStylesContainer () {
        return (
            new ContainerVNode({
                component: "style",
                attributes: {
                    id: "application-default-styles"
                },
                body: new TextVNode(this.defaultStyles)
            })
        )
    }
}
