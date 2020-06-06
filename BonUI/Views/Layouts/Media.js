//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"

function camelCaseToHyphen (string) {
    return string.replace(/[A-Z]/g, value => {
        return "-" + value.toLowerCase()
    })
}

const isDimension = value => /[height|width]$/.test(value)

export function jsonToMediaQuery (object) {
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
 * View that will return specific content depending on the media request value
 */
export class Media extends View {
    initialState () {
        return { value: false }
    }

    /**
     * 
     * @param {String|Object}   media               media request
     * @param {Function}        viewFunc            function that gets true/false (media matches or not) and returns the view/virtual node that will be shown depending on the value
     */
    constructor (media, viewFunc) {
        super({ viewFunc })

        // check if running in browser
        if (typeof window === "object" && "matchMedia" in window) {
            var _media
            if (typeof media === "object") {
                _media = jsonToMediaQuery(media)
            } else {
                _media = String(media)
            }
    
            this._mediaQuery = window.matchMedia(_media)
            this._mediaQuery.addListener(event => {
                console.log(event)
                this.state.set({
                    value: event.matches
                })
            })

            this.state.current.value = this._mediaQuery.matches
        }
    }

    body () {
        return this.options.viewFunc(this.state.get("value"))
    }
}

