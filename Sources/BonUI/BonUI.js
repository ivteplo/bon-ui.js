//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

// Views
import { BackgroundModifier } from "./Modifiers/BackgroundModifier.js"
import { Color } from "./Values/Color.js"
import { View } from "./Views/View.js"

/**
 * Method to set background of the view
 * @param {View|Color} color 
 */
View.prototype.background = function (color) {
    return this.modifier(new BackgroundModifier(color))
}

export { View }

export * from "./Views/ViewBuilder.js"
export * from "./Views/ViewController.js"
// -> Generic
export * from "./Views/Generic/Text.js"
export * from "./Views/Generic/Image.js"
export * from "./Views/Generic/Spacer.js"
export * from "./Views/Generic/Divider.js"
export * from "./Views/Generic/EmptyView.js"
// -> Controls
export * from "./Views/Controls/Button.js"
export * from "./Views/Controls/Control.js"
export * from "./Views/Controls/TextField.js"
export * from "./Views/Controls/SecureField.js"
export * from "./Views/Controls/FocusableControl.js"
// -> Layouts
export * from "./Views/Layouts/Row.js"
export * from "./Views/Layouts/Media.js"
export * from "./Views/Layouts/Column.js"
export * from "./Views/Layouts/ZStack.js"
export * from "./Views/Layouts/Section.js"
// -> Navigation
export * from "./Views/Navigation/NavigationView.js"
export * from "./Views/Navigation/NavigationLink.js"
// -> Shapes
export * from "./Views/Shapes/Circle.js"
export * from "./Views/Shapes/Rectangle.js"

// View Modifiers
export * from "./Modifiers/ViewModifier.js"
export * from "./Modifiers/ViewVNodeModifier.js"

// Application
export * from "./Application/Scene.js"
export * from "./Application/Application.js"

// Worker
export * from "./Worker.js"

// Enums
export * from "./Values/Enums/Edge.js"
export * from "./Values/Enums/Alignment.js"
export * from "./Values/Enums/Position.js"

// Values
export * from "./Values/Font.js"
export * from "./Values/State.js"
export * from "./Values/Color.js"
export * from "./Values/Length.js"
export * from "./Values/ClickInfo.js"
export * from "./Values/Exceptions.js"
