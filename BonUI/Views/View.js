//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

export class View {
  constructor() {
    this._nativeViewBuilder = null
    this._built = null
    this._scene = null
  }

  refresh() {
    this._nativeViewBuilder.update({ view: this, scene: this._scene })
  }
}
