//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { VNode } from "../../../VirtualDOM/VNode.js"
import { State } from "../../Values/State.js"
import { View } from "../View.js"

function camelCaseToHyphen (string) {
    return string.replace(/[A-Z]/g, value => {
        return "-" + value.toLowerCase()
    })
}

const isDimension = value => /[height|width]$/.test(value)

function jsonToMediaQuery (object) {
    var mediaQuery = ""
    const features = Object.keys(object)
    
    features.forEach((feature, index) => {
        var value = object[feature]
        feature = camelCaseToHyphen(feature)

        if (isDimension(feature) && typeof value === "number") {
            value += "px"
        }

        switch (value) {
            case true:
                mediaQuery += feature
                break
            case false:
                mediaQuery += "not " + feature
                break
            default:
                mediaQuery += `(${feature}: ${value})`
                break
        }

        if (index < features.length - 1) {
            mediaQuery += " and "
        }
    })

    return mediaQuery
}

/**
 * @callback MediaCallback
 * @param {boolean} matches media matches or not
 * @returns {View|VNode}
 */

/**
 * View that returns different content depending on the media request value.
 * @example
 * new Media({ media: { minWidth: 400 } }, widthBiggerThan400 => (
 *     new Text(`Your screen width is ${
 *         widthBiggerThan400 ? "bigger" : "smaller"} than 400px`)
 * ))
 * @category Views 
 * @subcategory Layouts
 */
export class Media extends View {
    /**
     * @param {object}          options
     * @param {string|object}   options.media               media request
     * @param {boolean}         [options.defaultValue]      what value to choose if can't check media query
     * @param {MediaCallback}   viewGetter                  function that gets true/false (media matches or not) as an argument and returns the view/virtual node that will be shown depending on the value
     */
    constructor ({ media, defaultValue = true } = {}, viewGetter) {
        super()

        var _defaultValue = defaultValue

        // check if running in browser
        if (typeof window === "object" && "matchMedia" in window) {
            let _media
            if (typeof media === "object") {
                _media = jsonToMediaQuery(media)
            } else {
                _media = String(media)
            }
    
            this._mediaQuery = window.matchMedia(_media)
            this._mediaQuery.addListener(event => {
                this._mediaState.dispatch({
                    type: "set",
                    value: event.matches
                })
            })

            _defaultValue = this._mediaQuery.matches
        }

        this._mediaState = new State((state = _defaultValue, action) => {
            switch (action.type) {
                case "set":
                    return action.value
                default:
                    return state
            }
        })

        this._mediaState.subscribe(() => {
            this.update()
        })

        this._viewGetter = viewGetter
    }

    get body () {
        return this._viewGetter(this._mediaState.current)
    }
}