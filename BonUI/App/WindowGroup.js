//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { View } from "../Views/index.js"
import { Scene } from "./Scene.js"
import { SceneBuilder } from "./SceneBuilder.js"

// TODO: jsdoc
export class WindowGroup extends Scene {
  // TODO: add description
  /**
   * @param {function(): View[]} windowItems
   */
  constructor(windowItems) {
    super()

    Object.defineProperty(this, "body", {
      get: () => windowItems()
    })

    this._window = null
  }

  /**
   * @param {SceneBuilder} builder
   */
  build(builder) {
    let window = builder.createWindow()
    this._window = window

    let body = this.body
    // TODO: think more about how window group works
    body.forEach(item => {
      // TODO: remove log
      console.log(item)
    })
  }
}
