//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { assert, warning } from "../Helpers.js"
import { Platform } from "./Platform.js"

export class Scene {
  /**
   * Function used to build the scene
   * @param {Platform} platform platform to build the scene for
   */
  build(platform) {
    assert(
      platform instanceof Platform,
      `Expected a Platform instance to be passed to ${this.constructor.name}#build`
    )

    warning(`${this.constructor.name}#build is not implemented`)
  }
}
