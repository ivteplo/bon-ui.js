//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { TextField } from "./TextField.js"

/**
 * View that represents a text field for passwords or any secure data that mustn't be shown on the screen.
 * @example
 * new SecureField({
 *     placeholder: "Your password"
 * }, textField => console.log(textField.value))
 * @category Views 
 * @subcategory Controls
 */
export class SecureField extends TextField {
    get body () {
        const result = super.body()
        result.attributes.type = "password"
        return result
    }
}
