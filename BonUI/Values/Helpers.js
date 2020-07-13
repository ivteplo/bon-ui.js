//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Alignment, VerticalAlignment, HorizontalAlignment } from "./Enums/Alignment.js"
import { ViewController } from "../Views/ViewController.js"
import { InvalidValueException } from "./Exceptions.js"
import { VNode } from "../VirtualDOM/VNode.js"
import { View } from "../Views/View.js"


export const camelCaseToHyphen = v => {
    var result = v.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase())
    while (result.length > 0 && result[0] === "-") {
        result = result.substr(1)
    } 
    
    while (result.length > 0 && result[result.length - 1] === "-") {
        result = result.slice(0, -1)
    }

    return result
}

export const addSlashBeforeDoubleQuotes = v => String(v).replace(/"/g, "\\\"")


export const flattenArray = array => {
    var result = array.map(i => Array.isArray(i) ? flattenArray(i) : [i])
    
    if (result.length > 0) {
        result = result.reduce((prev, curr) => prev.concat(curr))
    }

    return result
}


export const getClass = variable => (typeof variable === "object" ? (variable === null ? "null" : variable.constructor.name) : typeof variable)


export function convertToViewBodyItem (body) {
    var result = body

    if (typeof result === "function") {
        result = result()
    }

    if (Array.isArray(result)) {
        if (result.length > 1) {
            throw new InvalidValueException(`Expected body item (View or VNode), not an array of body items`)
        }

        result = result[0]
    }

    if (!(result instanceof View || result instanceof VNode)) {
        throw new InvalidValueException(`Expected View or VNode, got ${getClass(result)}`)
    }

    return result
}


export function convertToViewBody (items) {
    var result = items

    if (typeof result === "function") {
        result = result()
    }

    if (!Array.isArray(result)) {
        result = [ result ]
    }

    result = flattenArray(result).filter(v => Boolean(v))

    for (let i in result) {
        if (!(result[i] instanceof View || result[i] instanceof VNode)) {
            throw new InvalidValueException(`Expected View or VNode instance as body item, got ${getClass(result[i])}`)
        }
    }

    return result
}


export function horizontalAlignmentToAlignItems (alignment) {
    switch (alignment) {
        case HorizontalAlignment.leading:
            return "flex-start"
        case HorizontalAlignment.center:
            return "center"
        case HorizontalAlignment.trailing:
            return "flex-end"
    }
}

export function verticalAlignmentToAlignItems (alignment) {
    switch (alignment) {
        case VerticalAlignment.top:
            return "flex-start"
        case VerticalAlignment.center:
            return "center"
        case VerticalAlignment.bottom:
            return "flex-end"
    }
}


export const alignmentToTextAlignmentProperties = (alignment) => ({
    textAlign: alignmentToHorizontalTextAlignment(alignment),
    verticalAlign: alignmentToVerticalTextAlignment(alignment)  
})

function alignmentToHorizontalTextAlignment (alignment) {
    switch (alignment) {
        case Alignment.topLeading:
        case Alignment.leading:
        case Alignment.bottomLeading:
            return "left"
        case Alignment.top:
        case Alignment.center:
        case Alignment.bottom:
            return "center"
        case Alignment.topTrailing:
        case Alignment.trailing:
        case Alignment.bottomTrailing:
            return "right"
    }
}

function alignmentToVerticalTextAlignment (alignment) {
    switch (alignment) {
        case Alignment.topLeading:
        case Alignment.top:
        case Alignment.topTrailing:
            return "top"
        case Alignment.leading:
        case Alignment.center:
        case Alignment.trailing:
            return "middle"
        case Alignment.bottomLeading:
        case Alignment.bottom:
        case Alignment.bottomTrailing:
            return "bottom"
    }
}


export function cloneObject (object) {
    if (!object) {
        return object
    }
    
    if (Array.isArray(object)) {
        return object.concat([])
    }

    var clone = Object.assign({}, object)
    clone.__proto__ = object.__proto__
    return clone
}


export function cloneView (view) {
    var clone = cloneObject(view)
    clone.controller = new ViewController(clone)
    return clone
}
