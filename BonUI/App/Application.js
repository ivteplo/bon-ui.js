//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { Platform } from "./Platform.js"
import { assert } from "../Helpers.js"
import { Scene } from "./Scene.js"

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

  get body() {}

  /**
   * Function used to start the app
   */
  start() {
    if (!(this.platform instanceof Platform)) {
      this.platform = this.constructor._detectPlatform()
    }

    assert(
      this.platform instanceof Platform,
      "Sorry, your platform is not supported"
    )

    const body = this.body || new Scene()
    body.build(this.platform.sceneBuilder)
  }
}

/**
 * Decorator to mark the class as the application's main
 * @param {function} Class class that extends {@link Application}
 * @returns {function} modified constructor
 */
export function main(Class) {
  if (app) {
    throw new Error('There is already a class with "main" decorator')
  }

  return (...args) => {
    app = new Class(...args)

    assert(app instanceof Application, "Expected an Application instance")

    app.start()

    return app
  }
}
