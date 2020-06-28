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
    constructor () {
        this.container = null
        this.sceneContainer = null
        this.currentScene = null
    }

    /**
     * Method that returns array of application scenes
     */
    body () {
        return [
            new Scene("main", new EmptyView())
        ]
    }

    /**
     * Method to launch an app
     */
    launch () {
        this.sceneContainer = this.constructor.createSceneContainer()

        this.container = this.constructor.createApplicationContainer([
            this.constructor.createStylesContainer(),
            this.sceneContainer
        ])

        this.container.toDomNode({ save: true })
        this.loadScene(this.constructor.mainSceneName)
        document.body.appendChild(this.container.dom)
    }

    loadScene (sceneName) {
        const oldScene = this.currentScene
        const body = this.body()
        var scene = null

        for (let i in body) {
            if (body[i] instanceof Scene && body[i].name === sceneName) {
                scene = body[i]
                break
            }
        }

        if (scene === null) {
            throw new SceneNotFoundException(`Couldn't find scene "${sceneName}"`)
        }

        scene.load(this.sceneContainer.dom)
        this.currentScene = scene

        if (oldScene instanceof Scene) {
            oldScene.close()
        }
    }

    /**
     * Application main
     */
    static main () {
        const App = this
        const application = new App()
        Application.shared = application
        this.shared = application
        application.launch()
    }

    /**
     * Application instance (it's set in main function)
     */
    static shared = null

    /**
     * Main scene name
     */
    static mainSceneName = "main"

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

    /**
     * Function that returns container for application scenes
     * @returns {ContainerVNode}
     */
    static createSceneContainer () {
        return (
            new ContainerVNode({
                component: "div",
                attributes: {
                    id: "scene-container"
                },
                styles: {
                    width: "100%",
                    height: "100%"
                }
            })
        )
    }
}
