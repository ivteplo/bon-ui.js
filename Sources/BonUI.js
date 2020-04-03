//
// BonUI.js
// Created on 06/01/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

// Views
    // Core
    export * from "./Views/View"
    export * from "./Views/ViewState"
    export * from "./Views/ViewStateResponse"

    // Generic
    export * from "./Views/Generic/Text"
    export * from "./Views/Generic/Link"
    export * from "./Views/Generic/Image"
    export * from "./Views/Generic/Control"
    export * from "./Views/Generic/Canvas"

    // Forms
    export * from "./Views/Form/Button"
    export * from "./Views/Form/TextBox"

    // Layouts
    export * from "./Views/Layouts/HStack"
    export * from "./Views/Layouts/VStack"
    export * from "./Views/Layouts/ZStack"
    export * from "./Views/Layouts/List"
    
// VirtualDOM
export * from "./VirtualDOM/VNode"

// Values
export * from "./Values/Enum"
export * from "./Values/Font"
export * from "./Values/Color"
export * from "./Values/Length"
export * from "./Values/FitType"
export * from "./Values/Alignment"
export * from "./Values/Positioning"
export * from "./Values/OutlineStyle"
export * from "./Values/WhiteSpaceStyle"

// Styles
/**
 * A function that makes the page look better
 * @param {Object}  options
 * @param {Boolean} options.applyFlexToBody Applies the `display: flex` to the body if `true`
 */
export function normalizeDocumentStyles ({ applyFlexToBody = true }) {
    window.addEventListener ("load", () => {
        document.querySelectorAll("html, body").forEach(item => {
            item.style.margin = "0"
            item.style.padding = "0"
        })
        
        document.body.style.minHeight = "100vh"
        document.body.style.font = "normal 14pt sans-serif"

        if (applyFlexToBody) {
            document.body.style.display = "flex"
            document.body.style.alignItems = "center"
            document.body.style.justifyContent = "center"
        }
    })
}

// Helpers
export * from "./Application"
