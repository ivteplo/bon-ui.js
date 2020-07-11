//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { SizeModifier } from "../../Modifiers/SizeModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { View } from "../View.js"

/**
 * View that tries to insert some space between items or to fill the parent.
 * @example
 * new Row([
 *     new Text("Logo"),
 *     new Spacer(),
 *     new Text("Small text about the website or company")
 * ])
 * @category Views 
 * @subcategory Generic
 */
export class Spacer extends View {
    get body () {
        const styles = {}

        if (!this.hasVNodeModifier(SizeModifier)) {
            styles.flexGrow = "1"
        }

        return new VNode("bon-ui-spacer", { styles })
    }
}
