//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { View, Text, ApplicationManager } from "../../BonUI.js"

class AppView extends View {
    body () {
        return (
            new Text("hello world!")
        )
    }
}

const appManager = new ApplicationManager()
appManager.setView(new AppView())

console.log("Application manager")
    console.log(" - must add handlers to the view")
    assertEquals(appManager.view._handlers.mounting.length, 1)
    assertEquals(appManager.view._handlers.unmounting.length, 1)
    assertEquals(appManager.view._handlers.invalidation.length, 1)
    assertEquals(appManager.view._handlers.hydration.length, 1)
    console.log("   -> passed")

