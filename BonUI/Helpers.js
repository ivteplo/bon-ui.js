//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

export function assert(condition, ...data) {
  if (!condition) {
    throw new Error(...data)
  }
}

export function warning(...data) {
  console.warn(...data)
}
