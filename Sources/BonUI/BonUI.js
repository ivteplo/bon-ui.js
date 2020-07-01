//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

// Background modifier is added here because of circular dependencies
import { View } from "./Views/View.js"
import { BackgroundModifier } from "./ViewModifiers/BackgroundModifier.js"

/**
 * Method to set background of the view
 * @param {View|Color} background background of the view
 */
View.prototype.background = function (background) {
    return this.modifier(new BackgroundModifier(background))
}



// Views
export { View }
// -> Generic
export * from "./Views/Generic/Text.js"
export * from "./Views/Generic/Spacer.js"
export * from "./Views/Generic/Divider.js"
export * from "./Views/Generic/EmptyView.js"
// -> Controls
export * from "./Views/Controls/Control.js"
export * from "./Views/Controls/FocusableControl.js"
export * from "./Views/Controls/Button.js"
export * from "./Views/Controls/TextField.js"
// -> Layouts
export * from "./Views/Layouts/Row.js"
export * from "./Views/Layouts/Column.js"
export * from "./Views/Layouts/ZStack.js"
export * from "./Views/Layouts/Section.js"
// -> Navigation
export * from "./Views/Navigation/NavigationView.js"
export * from "./Views/Navigation/NavigationLink.js"
// -> Shapes
export * from "./Views/Shapes/Rectangle.js"

// View Modifier
export * from "./ViewModifiers/ViewModifier.js"

// Virtual DOM
export * from "./VirtualDOM/TextVNode.js"
export * from "./VirtualDOM/ContainerVNode.js"
export * from "./VirtualDOM/NSElementVNode.js"

// Application
export * from "./Application/Scene.js"
export * from "./Application/Application.js"
export * from "./Application/ViewBuilder.js"
export * from "./Application/ViewController.js"

// Worker
export * from "./Worker.js"

// Values
export * from "./Values/Edge.js"
export * from "./Values/Font.js"
export * from "./Values/State.js"
export * from "./Values/Color.js"
export * from "./Values/Length.js"
export * from "./Values/Alignment.js"
export * from "./Values/ClickInfo.js"
export * from "./Values/Exceptions.js"
