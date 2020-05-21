//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum"

/**
 * A enum that contains possible fit types. Used for Image view
 * @enum
 * @property {Symbol} cover             The image will be bigger than or equal to the specified size
 * @property {Symbol} fill              The image will be stretched
 * @property {Symbol} contain           The image will be less than or equal to the specified size
 * @property {Symbol} none              The image is not resized
 */
export const FitType = new Enum("cover", "fill", "contain", "none")

/**
 * A function to convert the FitType enum item to css value
 * @param   {Symbol} type
 * @returns {String} CSS `object-fit` value
 */
export function fitTypeToCssValue(type) {
    if (!FitType.contains(type)) {
        return undefined
    }

    switch (type) {
        case FitType.cover:
            return "cover"
        case FitType.fill:
            return "fill"
        case FitType.contain:
            return "contain"
        case FitType.none:
            return "none"
        case FitType.scaleDown:
            return "scale-down"
    }
}

