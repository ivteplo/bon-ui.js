export class ServiceWorkerLoader {
    /**
     * A method to register a service worker
     * @param {String} filePath Relative to the `Distribution` folder path to the file, where the service worker is
     */
    static register(filePath) {
        if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register(filePath).then(registration => {
                    console.log("Service worker registered successfully with scope: ", registration.scope)
                }, error => {
                    console.log("Service worker registration failed: ", error)
                })
            })
        }
    }
}

