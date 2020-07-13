//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { createColorSchemeState, Color } from "../Values/Color.js"
import { SceneNotFoundException } from "../Values/Exceptions.js"
import { DOMRenderer } from "../Renderers/DOMRenderer.js"
import { EmptyView } from "../Views/Generic/EmptyView.js"
import { Renderer } from "../Renderers/Renderer.js"
import { SceneBuilder } from "./SceneBuilder.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { Scene } from "./Scene.js"

/**
 * Main application's class.
 * @category Application lifecycle
 */
export class Application {
    constructor () {
        /**
         * Application renderer
         * @type {Renderer?}
         */
        this.renderer = typeof window === "object" ? DOMRenderer : null
        /**
         * Current scene
         * @type {Scene?}
         */
        this.currentScene = null
        /**
         * Virtual DOM node of application wrapper
         * @type {VNode?}
         */
        this.vNode = null
        /**
         * Main color of the app
         * @type {Color?}
         */
        this.mainColor = null
        /**
         * Title of the application window. To set the value, use {@link Application#setTitle}
         * @type {string}
         */
        this.title = "App"
        /**
         * True if app has loaded
         */
        this.loaded = false
    }

    /**
     * Method to set the title of the application window
     * @param {string} title title to set
     */
    setTitle (title) {
        this.title = String(title)
        if (this.loaded) {
            this.renderer.setWindowTitle(this.title)
        }
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
     * Method that is called when user changes prefered color scheme.
     * It's the best place to set the main color of the app.
     * @example
     * class App extends Application {
     *     onColorSchemeChange () {
     *         // most of default colors are also changing depending on color scheme
     *         // colors that don't change: white, lightGray (lightGrey), gray (grey), darkGray (darkGrey) and black
     *         this.mainColor = Color.blue
     *     }
     *     
     *     // ...
     * }
     */
    onColorSchemeChange () {}

    /**
     * Method to launch an app
     */
    launch () {
        const { mainSceneName } = this.constructor
        const mainScene = this.getScene(mainSceneName)
        
        this.renderer.prepare()

        this.renderer.setWindowTitle(this.title)
        
        this.onColorSchemeChange()

        const getNode = () => (new VNode("bon-ui-application", {
            styles: {
                backgroundColor: Color.background,
                color: Color.primary
            }
        }))

        const colorState = createColorSchemeState()
        colorState.subscribe(() => {
            const newNode = getNode()
            this.renderer.update(newNode, this.vNode, this.vNode.built)
            this.vNode = newNode
            // using controller's updateView method
            // because it does not schedule update
            this.currentScene.view.controller.updateView()
            this.onColorSchemeChange()
        })

        // declaring node here because colorState loads current color scheme
        this.vNode = getNode()
        this.renderer.mount(this.vNode)

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
