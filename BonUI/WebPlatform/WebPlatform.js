//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { Platform } from "../App/index.js"
import { WebSceneBuilder } from "./WebSceneBuilder.js"
import { WebViewBuilder } from "./WebViewBuilder.js"

export class WebPlatform extends Platform {
  constructor() {
    super()

    this.sceneBuilder = new WebSceneBuilder()
    this.viewBuilder = new WebViewBuilder()
  }
}
