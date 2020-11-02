//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { Platform } from "./Platform.js"
import { assert } from "../Helpers.js"
import { WindowGroup } from "./WindowGroup.js"

let app

/**
 * Main class that represents the entire app
 */
export class Application {
  static _platforms = []

  /**
   * Function to add platform support for application
   * @param {function(): Platform|null} platformGetter function that returns the Platform instance if the device runs on this platform, else null
   */
  static addPlatform(platformGetter) {
    this._platforms.push(platformGetter)
  }

  /**
   * Function used by class to detect the device platform
   * @returns {Platform|undefined}
   */
  static _detectPlatform() {
    for (let platformGetter of this._platforms) {
      let platform = platformGetter()
      if (platform instanceof Platform) {
        return platform
      }
    }
  }

  constructor() {
    /**
     * @type {Platform|null}
     */
    this.platform = null
  }

  /**
   * Function used to start the app
   */
  main() {
    if (!(this.platform instanceof Platform)) {
      this.platform = this.constructor._detectPlatform()
    }

    assert(
      this.platform instanceof Platform,
      "Sorry, your platform is not supported"
    )

    const body = this.body || new WindowGroup()
    body.build(this.platform)
  }
}
