//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { View, Text, State } from "@teplovs/bon-ui"

export class Content extends View {
  @State name = "User"

  constructor() {
    super()

    setTimeout(() => {
      this.name = "World"
    }, 2000)
  }

  get body() {
    return new Text("Hello " + this.name)
  }
}
