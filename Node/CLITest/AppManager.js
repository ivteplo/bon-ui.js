import { AppView } from "./Views/AppView"

export default class AppManager extends ApplicationManager {
    initialize() {
        this.setView(new AppView())
            .setTitle("Bon UI - Hello World!")
            .setIcon(resource("favicon.ico"))
    }

    loadApp(options) {
        // function `ApplicationManager.normalizeDocumentStyles` removes margins 
        // and paddings from the `html` and `body`.
        // if you have set `flexBody` to `true` then
        // the `display: flex` style will be applied to the body
        // (`AppManager` extends `ApplicationManager`)
        AppManager.normalizeDocumentStyles({ flexBody: true })
        return super.loadApp(options)
    }
}


