//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { View } from "../View.js"
import { Axis } from "../../Values/Axis.js"
import { Colors } from "../../Values/Color.js"
import { percents } from "../../Values/Length.js"


export class Separator extends View {
    /**
     * @param {Symbol} axis item of the Axis enum
     */
    constructor (axis = Axis.horizontal) {
        super({ axis })

        const offset = 10

        switch (this.options.axis) {
            case Axis.horizontal:
                this.size({ width: percents(100), height: 1 })
                    .offset({ top: offset, bottom: offset })
                break
            case Axis.vertical:
                this.size({ width: 1 })
                    .applyCSS({ alignSelf: "stretch" })
                    .offset({ left: offset, right: offset })
                break
            default:
                throw new Error("Unexpected axis passed. Expected item of Axis enum.")
                break
        }

        this.background({ color: Colors.theme.separator })
            .applyCSS({ flexShrink: "0" })
    }
}

