//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

/**
 * Class that represents DOM item
 */
export class VNode {
    /**
     * 
     * @param {string}      tag tag of the node
     * @param {object}      options
     * @param {object}      [options.attributes]
     * @param {object}      [options.styles]
     * @param {object}      [options.handlers]
     * @param {VNode[]}     [options.body]
     * @param {string}      [options.xmlNamespace]
     * @param {(View[])?}   [options.views]
     */
    constructor (tag, { attributes = {}, styles = {}, handlers = {}, body = [], xmlNamespace = "", views = [] } = {}) {
        this.tag = String(tag)
        this.attributes = attributes
        this.styles = styles
        this.handlers = handlers
        this.body = body
        this.xmlNamespace = xmlNamespace

        this.built = null
        this.renderer = null

        this.views = views

        this.vNodeHandlers = {
            didAppear: [],
            didUpdate: [],
            didDisappear: [],
            willDisappear: [],
            willAppear: [],
            willUpdate: []
        }
    }

    onDidAppear (handler) {
        this.vNodeHandlers.didAppear.push(handler)
        return this
    }

    onDidUpdate (handler) {
        this.vNodeHandlers.didUpdate.push(handler)
        return this
    }

    onDidDisappear (handler) {
        this.vNodeHandlers.didDisappear.push(handler)
        return this
    }

    onWillAppear (handler) {
        this.vNodeHandlers.willAppear.push(handler)
        return this
    }

    onWillUpdate (handler) {
        this.vNodeHandlers.willUpdate.push(handler)
        return this
    }

    onWillDisappear (handler) {
        this.vNodeHandlers.willDisappear.push(handler)
        return this
    }

    handleDidAppear () {
        for (let handler of this.vNodeHandlers.didAppear) {
            handler()
        }
    }

    handleDidUpdate () {
        for (let handler of this.vNodeHandlers.didUpdate) {
            handler()
        }
    }

    handleDidDisappear () {
        for (let handler of this.vNodeHandlers.didDisappear) {
            handler()
        }
    }

    handleWillAppear () {
        for (let handler of this.vNodeHandlers.willAppear) {
            handler()
        }
    }

    handleWillUpdate () {
        for (let handler of this.vNodeHandlers.willUpdate) {
            handler()
        }
    }

    handleWillDisappear () {
        for (let handler of this.vNodeHandlers.willDisappear) {
            handler()
        }
    }

    /**
     * Method to find differences between nodes
     * @param {VNode} newNode 
     * @param {VNode} oldNode 
     * @returns {object} difference between nodes (handlers and body are not compared)
     */
    static diff (newNode, oldNode) {
        const diff = {
            attributes: [],
            styles: []
        }

        for (let key in oldNode.attributes) {
            if (!(key in newNode.attributes)) {
                diff.attributes.push({
                    todo: "remove",
                    key
                })
            } else if (newNode.attributes[key] !== oldNode.attributes[key]) {
                diff.attributes.push({
                    todo: "update",
                    key,
                    newValue: newNode.attributes[key]
                })
            }
        }

        for (let key in newNode.attributes) {
            if (!(key in oldNode.attributes)) {
                diff.attributes.push({
                    todo: "update",
                    key,
                    newValue: newNode.attributes[key]
                })
            }
        }

        for (let key in oldNode.styles) {
            if (!(key in newNode.styles)) {
                diff.styles.push({
                    todo: "remove",
                    key
                })
            } else if (newNode.styles[key] !== oldNode.styles[key]) {
                diff.styles.push({
                    todo: "update",
                    key,
                    newValue: newNode.styles[key]
                })
            }
        }

        for (let key in newNode.styles) {
            if (!(key in oldNode.styles)) {
                diff.styles.push({
                    todo: "update",
                    key,
                    newValue: newNode.styles[key]
                })
            }
        }

        return diff
    }
}
