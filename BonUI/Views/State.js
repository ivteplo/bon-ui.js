//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

export function State(target) {
  var value = target.initializer()

  target.descriptor = {
    get() {
      return value
    },
    set(newValue) {
      value = newValue
      this.refresh()
    },
  }

  target.kind = "method"
  target.placement = "prototype"
  delete target.initializer

  return target
}
