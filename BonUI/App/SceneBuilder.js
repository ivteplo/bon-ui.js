//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { warning } from "../Helpers.js"
import { Window } from "./Window.js"

export class SceneBuilder {
  /**
   * Function used to create an app window
   * @returns {Window}
   */
  createWindow() {
    warning(`${this.constructor.name}#createWindow is not implemented`)
  }
}
