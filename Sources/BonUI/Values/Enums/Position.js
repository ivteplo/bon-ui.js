//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"

/**
 * @enum     {Symbol}
 * @property {Symbol} relative
 * @property {Symbol} absolute
 * @property {Symbol} fixed
 * @property {Symbol} static
 * @property {Symbol} sticky
 */
export const Position = new Enum("relative", "absolute", "fixed", "static", "sticky")
