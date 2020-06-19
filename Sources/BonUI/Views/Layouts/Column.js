//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Row } from "./Row.js"

/**
 * A class that is used to create columns
 */
export class Column extends Row {
    body () {
        const result = super.body()
        result.styles.flexDirection = "column"
        return result
    }
}
