//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ApplicationManager } from "../BonUI/BonUI.js"
import { AppView } from "./AppView.js"

export default class AppManager extends ApplicationManager {
    initialize () {
        this.setView(new AppView())
            .setTitle("Bon UI - testing views")
    }
}
