//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { Enum } from "../../Values/Enum.js"
import { Colors } from "../../Values/Color.js"
import { percents } from "../../Values/Length.js"

/**
 * @enum
 * @property {Symbol} horizontal    horizontal direction
 * @property {Symbol} vertical      vertical direction
 */
export const Direction = new Enum("horizontal", "vertical")

export class Separator extends View {
    /**
     * @param {Symbol} direction item of the Direction enum
     */
    constructor (direction = Direction.horizontal) {
        super({ direction })

        const offset = 10

        switch (this.options.direction) {
            case Direction.horizontal:
                this.size({ width: percents(100), height: 1 })
                    .offset({ top: offset, bottom: offset })
                break
            case Direction.vertical:
                this.size({ width: 1, height: percents(100) })
                    .offset({ left: offset, right: offset })
                break
            default:
                throw new Error("Unexpected direction passed. Expected item of Direction enum.")
                break
        }

        this.background({ color: Colors.theme.separator })
            .applyCSS({ flexShrink: "0" })
    }
}

