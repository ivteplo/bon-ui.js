//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

/**
 * Used to generate a view for each item in the array
 * @param {Array}           info information used for generating views
 * @param {(View|VNode)[]}  body function that generates view for each item in the array
 */
export function ForEach (info, body) {
    if (!Array.isArray(info)) {
        throw new Error("Information passed for generating child views is not an array!")
    }

    return info.map((value, key) => body(value, key))
}
