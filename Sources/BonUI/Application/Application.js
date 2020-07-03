//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

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
    body () {
        return [
            new Scene("main", new EmptyView())
        ]
    }

    /**
     * Method to load scene
     * @param {Scene} scene 
     */
    loadScene (scene) {
        const { vNode: oldNode } = this

        this.vNode = new VNode("div", {
            attributes: {
                id: "application"
            },
            styles: {
                height: "100%"
            },
            body: [
                SceneBuilder.build(scene)
            ]
        })
        
        if (oldNode instanceof VNode && oldNode.built) {
            this.renderer.update(this.vNode, oldNode, built)
        } else {
            this.renderer.mount(this.vNode)
        }
    }

    /**
     * Method to launch an app
     */
    launch () {
        const { mainSceneName } = this.constructor
        const scenes = this.body()

        var mainScene

        for (let scene of scenes) {
            if (scene.name === mainSceneName) {
                mainScene = scene
                break
            }
        }

        if (!mainScene) {
            throw new SceneNotFoundException(`Scene "${mainSceneName}" is not found`)
        }

        this.renderer.prepare()
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
