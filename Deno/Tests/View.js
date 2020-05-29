//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { View, Text, VStack } from "../../BonUI.js"

/**
 * @todo setup browser environment
 * Browser environment is not set up and that's why this test won't work
 */

// eslint-disable-next-line semi
console.log("Render"); // don't remove ";" or code will break
(() => {
    class AppView extends View {
        initialState () {
            return { text: "Hello world!" }
        }

        body () {
            return (
                new Text(this.state.get("text"))
            )
        }
    }

    const content = new AppView()
    content.mountTo(document.body)

    console.log(" - must append child to the body")
    assertEquals(content.isMounted, true)
    assertEquals(content.lastVNode.dom.parentNode.tagName, "BODY")
    assertEquals(content.lastVNode.dom.innerHTML, "Hello world!")
    console.log("   -> passed")
    
    console.log(" - must update DOM on state change")
    content.state.set({ text: "Hi!" })
    assertEquals(content.lastVNode.dom.innerHTML, "Hi!")
    console.log("   -> passed")

})()

// eslint-disable-next-line semi
console.log("Reconcilation");
(() => {
    window.mountedTimes = 0

    function incrementMountedTimes () {
        window.mountedTimes += 1
    }

    class AppView extends View {
        initialState () {
            return { text: null }
        }

        body () {
            return (
                new VStack([
                    !this.state.get("text") ? null :
                        new Text(this.state.get("text")),

                    new Text("Hello")
                        .setKey(1)
                        .handle("mounting", incrementMountedTimes),

                    new Text("world!")
                        .setKey(2)
                        .handle("mounting", incrementMountedTimes)
                ])
            )
        }
    }

    const content = new AppView()
    content.mountTo(document.body)
    content.state.set({ text: "HI!" })

    console.log(" - must not remount items with key specified")
    assertEquals(window.mountedTimes, 2)
    console.log("   -> passed")
})()

// eslint-disable-next-line semi
console.log("Server side rendering");
(() => {
    class AppView extends View {
        initialState () {
            return {
                text: "Hello world!"
            }
        }

        body () {
            this.state.set("text", "Hi!")
            return (
                new Text(this.state.get("text"))
            )
        }
    }

    const content = new AppView()
    const result = content.toString()

    console.log(" - must correctly render to HTML string")
    assertEquals(result, `<p style='user-select:none;margin:0px;padding:0px;'>Hello world!</p>`)
    console.log("   -> passed")
    
    console.log(" - must not update state when rendering from server, and not set isMounted to true")
    assertEquals(content.state.get("text"), "Hello world!")
    assertEquals(content.isMounted, false)
    console.log("   -> passed")
})()

