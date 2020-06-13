//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"

/**
 * @enum
 * @property {Symbol} horizontal    horizontal axis
 * @property {Symbol} vertical      vertical axis
 * @property {Symbol} both          both horizontal and vertical axises
 */
export const Axis = new Enum("horizontal", "vertical", "both")

