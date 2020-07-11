//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBodyItem, cloneView } from "../../Values/Helpers.js"
import { HorizontalAlignment } from "../../Values/Enums/Alignment.js"
import { CSSModifier } from "../../Modifiers/CSSModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { Font, Weight } from "../../Values/Font.js"
import { percents } from "../../Values/Length.js"
import { Button } from "../Controls/Button.js"
import { Spacer } from "../Generic/Spacer.js"
import { Column } from "../Layouts/Column.js"
import { State } from "../../Values/State.js"
import { Color } from "../../Values/Color.js"
import { Text } from "../Generic/Text.js"
import { Row } from "../Layouts/Row.js"
import { View } from "../View.js"
import "../../jsdoc.js"

/**
 * View that is used for navigation.
 * @example
 * new NavigationView(
 *     new Text("This is home page")
 *         .navigationBarTitle(new Text("Home"))
 * )
 * @category Views
 * @subcategory Navigation
 */
export class NavigationView extends View {
    /**
     * 
     * @param {BodyOneChild} item
     */
    constructor (item) {
        super()

        /**
         * @type {View|VNode}
         * Parent view or virtual DOM node
         */
        this.parent = null

        this._items = [ item ]

        const navigationInitialState = {
            currentView: this._items[0]
        }

        this._navigationState = new State((state = navigationInitialState, action) => {
            switch (action.type) {
                case "navigate-to-not-root-view":
                    this._items.push(action.value)
                    return Object.assign(state, {
                        currentView: this._items[this._items.length - 1]
                    })
                case "navigate-back":
                    this._items.pop()
                    return Object.assign(state, {
                        currentView: this._items[this._items.length - 1]
                    })
                default:
                    return state
            }
        })

        this._navigationState.subscribe(() => {
            if (this.controller) {
                // using controller's `updateView` method
                // because it doesn't schedule the update
                this.controller.updateView()
            }
        })
    }

    /**
     * Method to navigate to another view
     * @param {View} view view to navigate to
     */
    navigateTo (view) {
        this._navigationState.dispatch({
            type: "navigate-to-not-root-view",
            value: view
        })
    }

    get body () {
        var navigationBarTitle
        var prevNavigationBarTitle
        var item = this._navigationState.current.currentView

        if (item instanceof View && item._navigationBarTitle instanceof View) {
            let { _navigationBarTitle: title } = item

            if (title) {
                title = convertToViewBodyItem(title)
                navigationBarTitle = cloneView(title)
            }
        }

        if (this._items.length > 1) {
            let { _navigationBarTitle: title } = this._items[this._items.length - 2]
            
            if (title) {
                prevNavigationBarTitle = cloneView(convertToViewBodyItem(title))
            }
        }

        return (
            new Column([
                new Row([
                    this._items.length <= 1 ? null :
                        new Button(
                            new Row([
                                new Text("<"),

                                prevNavigationBarTitle.modifier(new CSSModifier({
                                    font: "inherit",
                                    color: "inherit"
                                })),
                            ]),
                            
                            () => {
                                this._navigationState.dispatch({ type: "navigate-back" })
                            }
                        ),


                    new Spacer()
                ])
                .font(Font.title.with({ size: Font.text.size, weight: Weight.bold }))
                .size({ height: 45 })
                .foregroundColor(Color.blue),

                new Row([
                    navigationBarTitle
                        .font(Font.largeTitle)
                ]),
                
                item,

                new Spacer()
            ], { alignment: HorizontalAlignment.leading })
                .padding(20)
                .size({ width: percents(100) })
                .minSize({ height: percents(100) })
                .modifier(new CSSModifier({ overflowX: "hidden", boxSizing: "border-box" }))
        )
    }
}