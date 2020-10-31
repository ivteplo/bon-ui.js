//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

export class View {
  constructor() {
    const bodyDescriptor = Object.getOwnPropertyDescriptor(this, "name")

    if (!bodyDescriptor) {
      this.body = null
    }
  }

  build() {

  }
}
