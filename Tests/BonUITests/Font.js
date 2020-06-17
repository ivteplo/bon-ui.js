//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import chai from "chai"
import browserEnv from "browser-env"
import { Font } from "../../Sources/BonUI/BonUI.js"

const { expect } = chai

browserEnv()

describe("Font", () => {
    it("must convert to string the right way", () => {
        expect(new Font({
            name: "Arial",
            size: 13
        }).toString()).to.equal(`13px Arial`)
    })
})
