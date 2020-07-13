//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { VNode } from "./VirtualDOM/VNode.js"
import { View } from "./Views/View.js"

/**
 * @typedef {View|VNode} BodyItem
 */

/**
 * @typedef {BodyItem|BodyItem[]} BodyItems
 */

/**
 * @callback BodyItemGetter
 * @returns {BodyItem}
 */

/**
 * @callback BodyItemsGetter
 * @returns {BodyItems}
 */

/**
 * @typedef {BodyItemsGetter|BodyItems} Body
 */

/**
 * @typedef {BodyItemGetter|BodyItem} BodyOneChild
 */

