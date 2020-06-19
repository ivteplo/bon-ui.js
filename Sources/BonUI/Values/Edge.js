//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"

/**
 * @enum
 * @property {Symbol} all
 * @property {Symbol} top
 * @property {Symbol} left
 * @property {Symbol} right
 * @property {Symbol} bottom
 */
export const Edge = new Enum("all", "top", "left", "right", "bottom")
