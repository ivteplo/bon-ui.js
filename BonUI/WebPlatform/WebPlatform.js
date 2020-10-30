//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { Platform } from "../App/index.js"
import { WebWindow } from "./WebWindow.js"

export class WebPlatform extends Platform {
  createWindow() {
    // TODO: add support for other windows

    return new WebWindow(window)
  }
}
