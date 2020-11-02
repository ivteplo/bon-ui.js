//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { assert } from "../Helpers.js"
import { View } from "../Views/index.js"
import { Platform } from "./Platform.js"
import { Scene } from "./Scene.js"

/**
 * Scene that represents a group of windows that have the same structure.
 */
export class WindowGroup extends Scene {
  /**
   * @param {function(): View} body getter for a view
   */
  constructor(body) {
    super()

    Object.defineProperty(this, "body", {
      get: () => body(),
    })

    this._window = null
  }

  /**
   * @param {Platform} platform platform to build the scene for
   */
  build(platform) {
    let window = platform.sceneBuilder.createWindow()
    this._window = window

    let body = this.body

    assert(body instanceof View, "WindowGroup body has to be a View instance")

    let builtView = platform.viewBuilder.build({ view: body, scene: this })
    window.addBuiltView(builtView)
  }
}
