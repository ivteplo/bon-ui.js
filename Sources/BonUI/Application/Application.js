//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { createColorSchemeState, Color } from "../Values/Color.js"
import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { EmptyView } from "../Views/Generic/EmptyView.js"
import { TextVNode } from "../VirtualDOM/TextVNode.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { Font } from "../Values/Font.js"
import { Scene } from "./Scene.js"

export class Application {
    constructor () {
        this.container = null
        this.sceneContainer = null
        this.currentScene = null
        this.title = ""
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
     * Method to set title of the app
     * @param {string} title title of the app
     */
    setTitle (title) {
        this.title = title

        if (typeof document === "object" && this.container) {
            document.title = title
        }
    }

    /**
     * Method to launch an app
     */
    launch () {
        document.title = this.title

        this.createContainer()
        this.container.toDomNode({ save: true })
        this.loadScene(this.constructor.mainSceneName)
        document.body.appendChild(this.container.dom)
    }

    createContainer () {
        this.sceneContainer = this.constructor.createSceneContainer()

        this.container = this.constructor.createApplicationContainer([
            this.constructor.createStylesContainer(),
            this.sceneContainer
        ])

        return this.container
    }

    /**
     * Method to get the html code of the app (for server-side rendering)
     */
    toString () {
        const sceneContainer = this.constructor.createSceneContainer()
        const scene = this.getScene(this.constructor.mainSceneName)
        const sceneVNode = scene.toVirtualDOMNode()

        sceneContainer.body = sceneContainer.getCurrentBody({ save: false })
        sceneContainer.body.push(sceneVNode)

        const container = this.constructor.createApplicationContainer([
            this.constructor.createStylesContainer(),
            sceneContainer
        ])

        container.body = container.getCurrentBody({ save: false })
        return container.toString()
    }

    /**
     * Method to get the scene with specified name
     * @param {string} sceneName name of the scene
     */
    getScene (sceneName) {
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

        return scene
    }

    /**
     * Method to load new scene
     * @param {string} sceneName name of the scene to load
     */
    loadScene (sceneName) {
        const oldScene = this.currentScene
        const scene = this.getScene(sceneName)

        scene.load(this.sceneContainer.dom)
        this.currentScene = scene

        if (oldScene instanceof Scene) {
            oldScene.close()
        }
    }

    /**
     * Application main function
     */
    static main () {
        const App = this
        const application = new App()
        Application.shared = application
        this.shared = application

        const colorSchemeState = createColorSchemeState()
        colorSchemeState.subscribe(() => {
            application.currentScene.updateView()
        })
        
        application.launch()
    }

    /**
     * @type {Application}
     * Application instance (it's set in main function)
     */
    static shared = null

    /**
     * @type {string}
     * Main scene name
     */
    static mainSceneName = "main"

    /**
     * @type {string}
     * Default app styles
     */
    static defaultStyles = (`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }
        
        body {
            font: ${Font.default.toString()};
            user-select: none;
            background: ${Color.background};
            color: ${Color.text};
        }

        @media (prefers-color-scheme: dark) {
            body {
                background-color: ${Color.themes.dark.background};
                color: ${Color.themes.dark.text}
            }
        }

        button {
            background: none;
            border: none;
            outline: none;
            font-size: inherit;
            cursor: pointer;
        }

        caption {
            display: block;
            text-align: initial;
        }
        
        input, input::placeholder,
        textarea, textarea::placeholder {
            font: inherit;
        }
        
        textarea, input {
            font-size: 1em;
            width: 100%;
            outline: none;
            border: none;
            resize: none;
            background: none;
        }
    `)

    /**
     * Function that creates container for an app
     * @param {function|VNode[]} body 
     * @returns {ContainerVNode}
     */
    static createApplicationContainer (body = []) {
        return (
            new ContainerVNode({
                component: "div",
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
                styles: {
                    position: "relative",
                    backgroundColor: "inherit",
                    overflow: "hidden",
                    width: "100%",
                    height: "100vh"
                },
                attributes: {
                    id: "scene-container"
                }
            })
        )
    }
}
