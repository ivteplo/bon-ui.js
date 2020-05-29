//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "./Views/View.js"
import { Color } from "./Values/Color.js"
import { VNode } from "./VirtualDOM/VNode.js"
import { Weight, FontStyle, weightToCssValue, fontStyleToCssValue } from "./Values/Font.js"

/**
 * Class that contains methods to manage the app
 * @todo Test new features
 */
export class ApplicationManager {
    constructor() {
        this._handlers = []

        this.title = ""
        this.fonts = []
        this.links = []
        this.meta = {}
        this.view = null
        this.serviceWorkerPath = null
        this.initialize()
    }

    /**
     * A method that is called after constructor
     * @example
     * import { AppView } from "./Views/AppView"
     * export default class AppManager extends ApplicationManager {
     *     initialize() {
     *         this.setView(new AppView())
     *     }
     * }
     */
    initialize() {}

    /**
     * A method that is called after the view is mounted
     * @param {View} view our view
     */
    handleViewMounting() {
        if (this._handlers.viewMounting) {
            this._handlers.viewMounting.forEach(handler => {
                handler(this)
            })
        }
    }

    /**
     * A method that is called after the view is unmounted
     * @param {View} view our view
     */
    handleViewUnmounting() {
        if (this._handlers.viewUnmounting) {
            this._handlers.viewUnmounting.forEach(handler => {
                handler(this)
            })
        }
    }

    /**
     * A method that is called after the view is hydrated
     * @param {View} view our view
     */
    handleViewHydration() {
        if (this._handlers.viewHydration) {
            this._handlers.viewHydration.forEach(handler => {
                handler(this)
            })
        }
    }

    /**
     * A method that is called after the view is invalidated
     * @param {View} view our view
     */
    handleViewInvalidation() {
        if (this._handlers.viewInvalidation) {
            this._handlers.viewInvalidation.forEach(handler => {
                handler(this)
            })
        }
    }

    /**
     * A method to add the handler for specific application manager event
     * @param {string}      event   Event name
     * @param {function}    handler Event handler
     */
    handle (event, handler) {
        if ((typeof event === "string" || event instanceof String) && (typeof handler === "function" || handler instanceof Function)) {
            if (!Array.isArray(this._handlers[event])) {
                this._handlers[event] = []
            }

            this._handlers[event].push(handler)
        }

        return this
    }

    /**
     * A method to set the title of the web app
     * @param {String} title Title of the app
     */
    setTitle(title) {
        if (typeof title === "string") {
            this.title = String(title)
        }

        return this
    }

    /**
     * A method to add font to fonts list
     * @param   {Object}    options
     * @param   {String}    options.name       Name of a font
     * @param   {String}    options.url        Path to the font file
     * @param   {Symbol}    [options.weight]   Weight of the font. Item of the Weight enum
     * @param   {Symbol}    [options.style]    Style of the font. Item of the FontStyle enum
     */
    addFont({ name, url, weight = null, style = null }) {
        var descriptors = {}

        if (Weight.contains(weight)) {
            descriptors.weight = weightToCssValue(weight)
        }

        if (FontStyle.contains(style)) {
            descriptors.style = fontStyleToCssValue(style)
        }

        descriptors.name = name

        var font = new FontFace(name, `url(${url})`, descriptors)
        this.fonts.push(font)

        return this
    }

    /**
     * A method to set the main view of the app (please, set the view only once: full support for changing view is not implemented)
     * @param {View} view View that represents the app
     */
    setView(view) {
        if (view instanceof View) {
            this.view = view
            const handlers = {
                mounting: this.handleViewMounting.bind(this),
                unmounting: this.handleViewUnmounting.bind(this),
                invalidation: this.handleViewInvalidation.bind(this),
                hydration: this.handleViewHydration.bind(this)
            }
            
            for (let event in handlers) {
                this.view.handle(event, handlers[event])
            }
        } else {
            throw new Error("Unexpected " + typeof view + " passed. Expected view")
        }

        return this
    }

    /**
     * Method to set the icon for the app
     * @param {String}          iconPath
     * @param {Object}          [options]
     * @param {Boolean}         [options.ico]   set to true if your icon has .ico format
     */
    setIcon(iconPath, options = {}) {
        if (typeof iconPath === "string") {
            if (options.ico) {
                this.links.push({
                    rel: "shortcut icon",
                    href: iconPath
                })
            } else {
                this.links.push({
                    rel: "icon",
                    href: iconPath
                })
            }
        }
        
        return this
    }

    /**
     * Method to set the primary color of the colorscheme
     * @param {Color} color theme primary color
     */
    setThemeColor(color) {
        if (color instanceof Color) {
            this.meta.themeColor = color.toString()
        }
        
        return this
    }

    /**
     * Method to set the list of the keywords
     * @param {String[]} keywordsList list of keywords
     */
    setKeywords(keywordsList) {
        if (Array.isArray(keywordsList)) {
            this.meta.keywords = keywordsList.filter(v => typeof v === "string").join(", ")
        }

        return this
    }

    /**
     * Method to set the description of the website
     * @param {String} description description of the website
     */
    setDescription(description) {
        if (typeof description === "string") {
            this.meta.description = description
        }

        return this
    }

    /**
     * Method to set the path to the service worker file
     * @param {String} serviceWorkerPath path to service worker
     */
    setServiceWorker(serviceWorkerPath) {
        if (typeof serviceWorkerPath === "string") {
            this.serviceWorkerPath = serviceWorkerPath
        }

        return this
    }

    /**
     * Method to register service worker
     */
    registerServiceWorker() {
        if (this.serviceWorkerPath && "serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register(this.serviceWorkerPath).then(registration => {
                    console.log("Service worker registered successfully with scope: ", registration.scope)
                }, error => {
                    console.log("Service worker registration failed: ", error)
                })
            })
        }
    }

    /**
     * A method to load the application view
     */
    mountView() {
        if (!document.body) {
            window.addEventListener("load", () => {
                this.loadView()
            })

            return
        }

        this.view.mountTo(this.root)
    }

    /**
     * A method to hydrate the application view
     * @param {Node} node Node that is the result of the server side rendering
     */
    hydrateView(node) {
        this.view.hydrate(node)
    }

    loadMeta() {
        if (document.head) {
            for (let key in this.meta) {
                let meta = document.createElement("meta")
                meta.setAttribute("name", key)
                meta.setAttribute("content", this.meta[key])
                document.head.appendChild(meta)
            }
        }
    }

    setupLinks() {
        if (document.head) {
            for (let i in this.links) {
                let link = document.createElement("link")

                for (let j in this.links[i]) {
                    link.setAttribute(j, this.links[i][j])
                }

                document.head.appendChild(link)
            }
        }
    }

    /**
     * A method to load added fonts asynchronously
     * @returns {Promise}
     */
    loadFonts() {
        return Promise.all(this.fonts.map(font => {
            return font.load().then(loadedFont => {
                document.fonts.add(loadedFont)
            })
        }))
    }

    /**
     * A method to load the app
     * @param {Object}  options
     * @param {Node}    [options.node] Node that will be used for hydration in case if the view was rendered from the server side
     */
    loadApp(options = {}) {
        const promises = Promise.all([
            this.loadFonts(),

            new Promise((resolve, reject) => {
                document.title = this.title
                resolve()
            }),

            options.node ? undefined :
                new Promise((resolve, reject) => {
                    this.setupLinks()
                    resolve()
                }),

            options.node ? undefined :
                new Promise((resolve, reject) => {
                    this.loadMeta()
                    resolve()
                }),

            new Promise((resolve, reject) => {
                if (options.node && options.node instanceof Node) {
                    this.hydrateView(options.node)
                } else {
                    this.mountView()
                }

                // if got here then resolve
                resolve()
            })
        ].filter(Boolean))

        return promises
    }

    /**
     * Method used to get the HTML of items in head like meta, title, link tags etc.
     * @returns {String} HTML string
     */
    getHeadString () {
        var tags = []

        for (let i in this.meta) {
            tags.push(
                new VNode({
                    tag: "meta",
                    attributes: {
                        name: i,
                        content: this.meta[i]
                    }
                })
            )
        }
        
        for (let i in this.links) {
            let link = new VNode({
                tag: "link",
                attributes: {}
            })

            for (let j in this.links[i]) {
                link.attributes[j] = this.links[i][j]
            }

            tags.push(link)
        }

        if (this.title != null) {
            tags.push(
                new VNode({
                    tag: "title",
                    body: [ new VNode({ text: this.title }) ]
                })
            )
        }

        return tags.map(tag => tag.toString()).join("\n")
    }

    getViewString () {
        return this.view.toString()
    }

    /**
     * A function that makes the page look better
     * @param {Object}  options
     * @param {Boolean} options.applyFlexToBody Applies the `display: flex` to the body if `true`
     * @todo replace to make support for server side rendering and to use it as class method
     */
    static normalizeDocumentStyles({ applyFlexToBody = true }) {
        if (!document.body) {
            window.addEventListener("load", () => __normalizeDocumentStyles({ applyFlexToBody }))
        } else {
            __normalizeDocumentStyles({ applyFlexToBody })
        }
    }
}

function __normalizeDocumentStyles({ applyFlexToBody }) {
    document.querySelectorAll("html, body").forEach(item => {
        item.style.margin = "0"
        item.style.padding = "0"
    })
    
    document.body.style.minHeight = "100vh"
    document.body.style.font = "normal 14pt sans-serif"

    if (applyFlexToBody) {
        document.body.style.display = "flex"
        document.body.style.alignItems = "center"
        document.body.style.justifyContent = "center"
    }
}
