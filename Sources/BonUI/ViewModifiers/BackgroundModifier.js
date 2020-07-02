//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { ContainerVNode } from "../VirtualDOM/ContainerVNode.js"
import { InvalidValueException } from "../Values/Exceptions.js"
import { Rectangle } from "../Views/Shapes/Rectangle.js"
import { ZStack } from "../Views/Layouts/ZStack.js"
import { SizeModifier } from "./SizeModifier.js"
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
            new SizeModifier({ width: percents(100), height: percents(100) })
        )
    }

    body (content) {
        return new ZStack([
            new ContainerVNode({
                component: "div",
                body: [
                    this.background
                ],
                styles: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    padding: "inherit",
                    overflow: "hidden"
                }
            }),

            content
                .position(Position.relative)
        ])
        .size({ width: percents(100) })
    }
}
