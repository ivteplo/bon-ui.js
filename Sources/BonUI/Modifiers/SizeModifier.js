//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { Length, pixels } from "../Values/Length.js"
import { CSSModifier } from "./CSSModifier.js"

export class SizeModifier extends CSSModifier {
    /**
     * 
     * @param {{
     *  width: Length?,
     *  height: Length?,
     *  prefix: string?
     * }} param0 sizes (width and height)
     */
    constructor ({ width, height, prefix = "" }) {
        const styles = {}

        if (width !== undefined && width !== null) {
            if (!(width instanceof Length || typeof width === "number")) {
                throw new InvalidValueException(`Expected Length instance as the width parameter`)
            }

            const widthLength = (
                typeof width === "number" 
                    ? pixels(width) 
                    : width
            )

            const widthStyleName = (
                prefix 
                    ? prefix + "Width"
                    : "width"
            )

            styles[widthStyleName] = widthLength.toString()
        }

        if (height !== undefined && height !== null) {
            if (!(height instanceof Length || typeof height === "number")) {
                throw new InvalidValueException(`Expected Length instance as the height parameter`)
            }

            const heightLength = (
                typeof height === "number" 
                    ? pixels(height) 
                    : height
            )

            const heightStyleName = (
                prefix
                    ? prefix + "Height"
                    : "height"
            )

            styles[heightStyleName] = heightLength.toString()
        }

        super(styles)
    }
}