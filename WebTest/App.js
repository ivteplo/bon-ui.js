//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache license 2.0
//

import { Application, WindowGroup } from "@teplovs/bon-ui"
import { Content } from "./Views/Content.js"

class App extends Application {
  main() {
    super.main()
    console.log("App Started")
  }

  get body() {
    return new WindowGroup(() => new Content())
  }
}

new App().main()
