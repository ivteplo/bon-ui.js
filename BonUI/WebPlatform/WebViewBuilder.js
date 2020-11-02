//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { ViewBuilder, WindowGroup } from "../App/index.js"
import { warning } from "../Helpers.js"

export class WebViewBuilder extends ViewBuilder {
  build({ view, scene } = {}) {
    const { rendered: representation, parents } = super.build({ view, scene })

    if (scene instanceof WindowGroup) {
      const representationToNative = (representation) => {
        switch (representation.type) {
          case "text":
            const span = document.createElement("span")
            span.innerHTML = representation.text
              .replace(/\</g, "&lt;")
              .replace(/\>/g, "&gt;")
            return span
        }
      }

      return representationToNative(representation)
    } else {
      warning("Unknown scene type")
    }
  }
}
