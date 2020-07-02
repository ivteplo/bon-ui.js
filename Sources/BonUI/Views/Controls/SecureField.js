//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { TextField } from "./TextField.js"

export class SecureField extends TextField {
    body () {
        const result = super.body()
        result.attributes.type = "password"
        return result
    }
}
