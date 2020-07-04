//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { Rectangle } from "../Views/Shapes/Rectangle.js"
import { ZStack } from "../Views/Layouts/ZStack.js"
import { ViewModifier } from "./ViewModifier.js"
import { getClass } from "../Values/Helpers.js"
import { CSSModifier } from "./CSSModifier.js"
import { percents } from "../Values/Length.js"
import { Color } from "../Values/Color.js"
import { View } from "../Views/View.js"
import { Position } from "../Values/Enums/Position.js"
import { SizeModifier } from "./SizeModifier.js"

export class BackgroundModifier extends ViewModifier {
    /**
     * @param {View|Color} background background view or color
     */
    constructor (background) {
        super()

        if (!(background instanceof View || background instanceof Color)) {
            throw new InvalidValueException(`Expected Color or View instance as the background parameter, got ${getClass(background)}`)
        }

        /**
         * @type {View}
         */
        this.background = (
            background instanceof Color 
                ? new Rectangle().foregroundColor(background).size({ width: percents(100), height: percents(100) })
                : background
        )

        this.background.prependVNodeModifier(new CSSModifier({
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }))
    }

    body (content) {
        var result = new ZStack([
            this.background,
            content.position(Position.relative)
        ])

        return result
    }
}