//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { createColorSchemeState, Color } from "../Values/Color.js"
import { SceneNotFoundException } from "../Values/Exceptions.js"
import { EmptyView } from "../Views/Generic/EmptyView.js"
import { Renderer } from "../../Renderers/Renderer.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { SceneBuilder } from "./SceneBuilder.js"
import { Scene } from "./Scene.js"

export class Application {
    constructor () {
        /**
         * @type {Renderer?}
         */
        this.renderer = null
        this.currentScene = null
        this.vNode = null
    }

    /**
     * Method that returns array of application scenes
     */
    get body () {
        return [
            new Scene("main", new EmptyView())
        ]
    }

    /**
     * Method to load scene
     * @param {Scene|string} scene scene or it's name
     */
    loadScene (scene) {
        var _scene = typeof scene === "string" ? this.getScene(scene) : scene

        const { currentScene: oldScene } = this

        if (oldScene) {
            this.renderer.unmount(oldScene.vNode)
            oldScene.view.destruct()
            oldScene.vNode = null
        }

        SceneBuilder.build(_scene)
        this.renderer.mount(_scene.vNode, "bon-ui-application")
        this.currentScene = _scene
    }

    /**
     * Method to get the Scene with specified name
     * @param {string} sceneName 
     * @returns {Scene}
     */
    getScene (sceneName) {
        var result

        ;(() => {
            const scenes = this.body
    
            for (let i = scenes.length - 1; i >= 0; --i) {
                let scene = scenes[i]
                if (scene.name === sceneName) {
                    result = scene
                    return
                }
            }
        })()

        if (!result) {
            throw new SceneNotFoundException(`Scene "${sceneName}" is not found`)
        }

        return result
    }

    /**
     * Method to launch an app
     */
    launch () {
        const { mainSceneName } = this.constructor
        const mainScene = this.getScene(mainSceneName)
        
        this.renderer.prepare()

        const getNode = () => (new VNode("bon-ui-application", {
            styles: {
                backgroundColor: Color.background,
                color: Color.primary
            }
        }))

        const colorState = createColorSchemeState()
        colorState.subscribe(() => {
            const newNode = getNode()
            this.renderer.update(newNode, node, node.built)
            // using controller's updateView method
            // because it does not schedule update
            this.currentScene.view.controller.updateView()
        })

        // declaring node here because colorState loads current color scheme
        const node = getNode()
        this.renderer.mount(node)

        this.loadScene(mainScene)
    }

    /**
     * Application main function
     */
    static main () {
        const App = this
        const application = new App()
        this.constructor.shared = application
        Application.shared = application

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
}
