//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { Window } from "../App/index.js"

export class WebWindow extends Window {
  constructor(nativeWindow) {
    super()

    this._native = nativeWindow

    const html = this._native.document.querySelector("html")
    const body = this._native.document.querySelector("body")

    ;[html, body].forEach((element) => {
      element.style.margin = 0
      element.style.padding = 0
      element.style.height = "100%"
    })

    body.style.fontSize = "18px"
    body.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  }
}
