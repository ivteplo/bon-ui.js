//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { warning } from "../Helpers.js"
import { SceneBuilder } from "./SceneBuilder.js"

export class Scene {
  /**
   * Function used to build the scene
   * @param {SceneBuilder} sceneBuilder
   */
  // eslint-disable-next-line no-unused-vars
  build(sceneBuilder) {
    warning(`${this.constructor.name}#build is not implemented`)
  }
}
