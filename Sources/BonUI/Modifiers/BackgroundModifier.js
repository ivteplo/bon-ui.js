//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { InvalidValueException } from "../Values/Exceptions.js"
import { Rectangle } from "../Views/Shapes/Rectangle.js"
import { Column } from "../Views/Layouts/Column.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { ViewModifier } from "./ViewModifier.js"
import { SizeModifier } from "./SizeModifier.js"
import { getClass } from "../Values/Helpers.js"
import { CSSModifier } from "./CSSModifier.js"
import { percents } from "../Values/Length.js"
import { Row } from "../Views/Layouts/Row.js"
import { Color } from "../Values/Color.js"
import { View } from "../Views/View.js"

/**
 * @ignore
 */
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

        this.background.prependVNodeModifier(new SizeModifier({
            width: percents(100), height: percents(100)
        }))
    }

    body (content) {
        content.prependVNodeModifier(new CSSModifier({
            position: "relative",
            zIndex: "1"
        }))

        return (
            new (content instanceof Row ? Column : Row)([
                new VNode("div", {
                    styles: {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: "0",
                        padding: "inherit",
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%"
                    },
                    body: [
                        this.background
                    ]
                }),

                content
            ], { spacing: 0 })
                .modifier(new CSSModifier({
                    alignItems: "none",
                    position: "relative"
                }))
        )
    }
}