//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

export function flattenArray (array) {
    var _array = []
    for (let i of array) {
        _array.push(...(Array.isArray(i) ? flattenArray(i) : [i]))
    }
    return _array
}

