//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

// importing modifiers
import { PositionModifier } from "./PositionModifier.js"
import { OffsetModifier } from "./OffsetModifier.js"
import { SizeModifier } from "./SizeModifier.js"

import { InvalidValueException } from "../Values/Exceptions.js"
import { Rectangle } from "../Views/Shapes/Rectangle.js"
import { ZStack } from "../Views/Layouts/ZStack.js"
import { Position } from "../Values/Position.js"
import { ViewModifier } from "./ViewModifier.js"
import { getClass } from "../Values/Helpers.js"
import { percents } from "../Values/Length.js"
import { Color } from "../Values/Color.js"
import { View } from "../Views/View.js"

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
                ? new Rectangle().foregroundColor(background)
                : background
        )
        
        this.background._vNodeModifiers.unshift(
            new OffsetModifier({ x: 0, y: 0 }),
            new SizeModifier({ width: percents(100), height: percents(100) }),
            new PositionModifier(Position.absolute)
        )
    }

    body (content) {
        return new ZStack([
            this.background,

            content
                .position(Position.relative)
        ])
        .size({ width: percents(100) })
    }
}
