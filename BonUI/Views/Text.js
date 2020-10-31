//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { View } from "./View.js"

export class Text extends View {
  constructor(text = "") {
    super()

    this.body = text
  }

  // build() {}
}
