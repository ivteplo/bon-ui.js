//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

export function assert(condition, ...data) {
  if (!condition) {
    throw new Error(...data)
  }
}
