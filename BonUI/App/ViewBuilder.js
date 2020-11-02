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
   */
  build({ view, scene } = {}) {
    assert(view instanceof View)
    assert(scene instanceof Scene)

    const recursiveViewRendering = (view) => {
      let rendered
      let children = []

      for (let { class: Class, builder } of extensions) {
        if (view instanceof Class) {
          rendered = builder(view)
        }
      }

      if (!rendered && "body" in view) {
        let { rendered: _rendered, parents } = recursiveViewRendering(view.body)
        rendered = _rendered
        children = parents
      }

      return {
        rendered,
        parents: [...children, view],
      }
    }

    return recursiveViewRendering(view)
  }
}
