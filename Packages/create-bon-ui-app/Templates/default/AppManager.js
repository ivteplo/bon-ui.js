import { ServiceWorkerLoader } from "./ServiceWorker/ServiceWorkerLoader"
import { ApplicationManager } from "@teplovs/bon-ui"
import { AppView } from "./Views/AppView"

class AppManager extends ApplicationManager {
    loadApp() {
        // function `ApplicationManager.normalizeDocumentStyles` removes margins 
        // and paddings from the `html` and `body`.
        // if you have set `flexBody` to `true` then
        // the `display: flex` style will be applied to the body
        // (`AppManager` extends `ApplicationManager`)
        AppManager.normalizeDocumentStyles({ flexBody: true })
        super.loadApp()
    }
}

ServiceWorkerLoader.register("ServiceWorker.js")

const appManager = new AppManager()
window.addEventListener("load", () => {
    appManager.setView(new AppView())
    appManager.setTitle("Bon UI - Hello World!")
    appManager.loadApp()
})
