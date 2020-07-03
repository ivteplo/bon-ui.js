//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"

/**
 * @enum     {Symbol}
 * @property {Symbol} topLeading
 * @property {Symbol} top
 * @property {Symbol} topTrailing
 * @property {Symbol} leading
 * @property {Symbol} center
 * @property {Symbol} trailing
 * @property {Symbol} bottomLeading
 * @property {Symbol} bottom
 * @property {Symbol} bottomTrailing
 */
export const Alignment = new Enum(
    "topLeading", "top", "topTrailing", 
    "leading", "center", "trailing", 
    "bottomLeading", "bottom", "bottomTrailing"
)

/**
 * @enum     {Symbol}
 * @property {Symbol} top
 * @property {Symbol} center
 * @property {Symbol} bottom
 */
export const VerticalAlignment = new Enum(
    "top",
    "center",
    "bottom"
)

/**
 * @enum     {Symbol}
 * @property {Symbol} leading
 * @property {Symbol} center
 * @property {Symbol} trailing
 */
export const HorizontalAlignment = new Enum(
    "leading",
    "center",
    "trailing"
)
