//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { assert } from "../Helpers.js"
import { View } from "../Views/View.js"
import { Scene } from "./Scene.js"

let extensions = []

/**
 * Class used for building views
 */
export class ViewBuilder {
  /**
   * Function to add an extension for building view to javascript object
   * @param {object} options
   * @param {function} options.class class to build
   * @param {function(): object} options.builder object representation of the view
   */
  static addExtension({ class: Class, builder } = {}) {
    extensions.push({ class: Class, builder })
  }

  /**
   * Function to build a view
   * @param {object} options
   * @param {View} options.view view to build
   * @param {Scene} options.scene scene to build
   * @returns {{
   *  rendered: object,
   *  parentViews: View[]
   * }}
   */
  build({ view, scene } = {}) {
    assert(
      view instanceof View,
      "Expected view to be an instance of View class"
    )

    assert(
      scene instanceof Scene,
      "Expected scene to be an instance of Scene class"
    )

    assert(false, "View building is not implemented")

    // TODO: update the way it works
  }

  /**
   * Function to update a view
   * @param {object} options
   * @param {View} options.view view to update
   * @param {Scene} options.scene scene the view belongs to
   */
  update({ view, scene } = {}) {
    // TODO: rerender the view and find differences
  }
}
