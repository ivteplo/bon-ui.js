//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View"

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
 * View that will return specific content depending on the media request value
 */
export class Media extends View {
    initialState () {
        return { value: false }
    }

    /**
     * 
     * @param {String|Object}   media               media request
     * @param {View|VNode}      contentIfTrue       content that will be returned if media matches
     * @param {View|VNode}      contentIfFalse      content that will be returned if media doesn't match
     */
    constructor (media, contentIfTrue, contentIfFalse) {
        super({ contentIfTrue, contentIfFalse })

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
                this.state.set({
                    value: event.matches
                })
            })

            this.state.current.value = mediaQuery.matches
        }
    }

    body () {
        return (
            this.state.get("value") === true ?
                this.options.contentIfTrue :
                this.options.contentIfFalse
        )
    }
}
