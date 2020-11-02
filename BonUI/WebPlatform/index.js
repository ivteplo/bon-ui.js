//
// Copyright (c) Ivan Zadvornov 2020
// Licensed under the Apache license 2.0
//

import { Application } from "../App/index.js"
import { WebPlatform } from "./WebPlatform.js"

Application.addPlatform(() =>
  typeof window === "object" ? new WebPlatform() : null
)
