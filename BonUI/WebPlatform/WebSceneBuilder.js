//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { SceneBuilder } from "../App/index.js"
import { WebWindow } from "./WebWindow.js"

export class WebSceneBuilder extends SceneBuilder {
  createWindow() {
    // TODO: add support for opening new tab in browser
    return new WebWindow(window)
  }
}
