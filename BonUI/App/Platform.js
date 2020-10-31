//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { SceneBuilder } from "./SceneBuilder.js"
import { ViewBuilder } from "./ViewBuilder.js"

export class Platform {
  constructor() {
    this.sceneBuilder = new SceneBuilder()
    this.viewBuilder = new ViewBuilder()
  }
}
