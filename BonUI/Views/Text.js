//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { ViewBuilder } from "../App/ViewBuilder.js"
import { View } from "./View.js"

export class Text extends View {
  constructor(text = "") {
    super()

    this._text = text
  }
}

ViewBuilder.addExtension({
  class: Text,
  builder: (view) => {
    return { type: "text", text: view._text }
  },
})
