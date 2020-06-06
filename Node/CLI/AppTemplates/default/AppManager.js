import { AppView } from "./Views/AppView"

export default class AppManager extends ApplicationManager {
    initialize() {
        this.setView(new AppView())
            .setTitle("Bon UI - Hello World!")
            .setServiceWorker("./ServiceWorker.js")
    }
}

