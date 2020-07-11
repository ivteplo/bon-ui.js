# Bon UI changelog

## 1.0.0-alpha
- Started refactoring the code
- Created `Application`, `Scene`, `SceneBuilder`, `ViewBuilder` and `ViewController`
- Created `WebLink` view
- Created `NavigationView` and `NavigationLink` views
- Created `DOMRenderer`
- Changed `VNode` class
- Updated `Worker` static method names
- Added `Circle` and `Rectangle` shapes
- Added `ClickInfo` class
- Added `Section` view
- Added `Spacer` view
- Added `Divider` view
- Added `EmptyView`
- Added `TextField` and `SecureField`
- Added `FocusableControl`
- Added `Edge` enum
- Added many view modifiers

## 0.2.0-alpha
- Renamed most of the methods of views to make the syntax better
- Old methods will be avaliable for some time
- Added `ScrollView`, `Media`

## 0.1.5-alpha
- Added CommonJS output type
- Added `View#hydrate` method
- Fixed `ApplicationManager.setTitle` error

## 0.1.4-alpha
- Fixed an error with setting `title` in the head

## 0.1.3-alpha
- Added `options` argument to the constructor of the View
- Created `ApplicationManager`
- Added server side rendering methods
- Added default color palettes
- Added `Router`

## 0.1.2-alpha
- Fixed an error about updating the views
- Added enum `WhiteSpaceStyle`
- Fixed `TextBox` bugs

## 0.1.1-alpha
- Created views `Control`, `TextBox`
- Added shorthands for using `Length` class

## 0.1.0-alpha
- Written the core of the framework
- Created views `Text`, `Button`, `HStack`, `VStack`, `ZStack`, `Link`, `List`, `Canvas`
