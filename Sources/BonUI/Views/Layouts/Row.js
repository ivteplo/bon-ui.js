//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { Column } from "./Column.js"

export class Row extends Column {
    body () {
        const body = super.body()
        body.styles.flexDirection = "row"
        return body
    }
}
