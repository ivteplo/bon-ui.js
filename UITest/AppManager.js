import { ApplicationManager } from "../BonUI.js"
import { AppView } from "./AppView.js"

export default class AppManager extends ApplicationManager {
    initialize () {
        this.setView(new AppView())
            .setTitle("Bon UI - testing views")
    }

    loadApp () {
        AppManager.normalizeDocumentStyles({ applyFlexToBody: true })
        super.loadApp()
    }
}
