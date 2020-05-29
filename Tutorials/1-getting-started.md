### Setting up the project
There is a boilerplate on Github. Clone it to your project folder by executing this command in the terminal:
```bash
git clone https://github.com/teplovs/bon-ui-boilerplate bon-ui-app
cd bon-ui
npm install # or `yarn install`
```

### Your first view
In Bon UI each component is called “a view”.
In file Sources/Views/AppView.js there is a description of the view App:
```javascript
import { View, Text } from "@teplovs/bon-ui"

export class AppView extends View {
    // this method describes how the "view" looks
    getBody() {
        return (
            new Text("Hello world!")
        )
    }
}
```

In file Sources/AppManager.js there are instructions for application loading:
```javascript
import { ApplicationManager } from "@teplovs/bon-ui"
import { AppView } from "./Views/AppView"

class AppManager extends ApplicationManager {
    loadApp() {
        // function `ApplicationManager.normalizeDocumentStyles` removes margins 
        // and paddings from the `html` and `body`.
        // if you have set `flexBody` to `true` then
        // the `display: flex` style will be applied to the body
        // method `mountTo` adds the view to the body
        // (`AppManager` extends `ApplicationManager`)
        AppManager.normalizeDocumentStyles({ flexBody: true })
        super.loadApp()
    }
}

const appManager = new AppManager()
window.addEventListener("load", () => {
    appManager.setView(new AppView())
    appManager.setTitle("Bon UI - Hello World!")
    appManager.loadApp()
})
```

The `getBody` method describes how our “view” looks. To do that you can use a `VNode` (virtual node) or other views. Fortunately, there are built-in components in the Bon UI framework.

### Your first app build
To build the app in a production mode (the `Build/bundle.js` will be minified), execute `npm run build`.
If you are developing the app, run `npm run watch`. The webpack will watch for chages in files and will rebuild the app (without minifying).

### Playing with the states
Let’s update the Sources/Views/AppView.js file to make it look this way:
```javascript

import { Text, Button, VStack, View } from "@teplovs/bon-ui"

export class AppView extends View {
    // this method returns the object that contains key: value pair of variables
    // that are in the state by default
    getInitialState() {
        return { clickedTimes: 0 }    
    }
    
    getBody() {
        return (
            // vertical stack
            // (the view can only return one another view/virtual node, so stacks are used to add some children)
            new VStack([
                new Text("You have clicked the button " + this.state.get("clickedTimes").toString() + " times")
                    .setOffset({ bottom: 10 }),
                
                // the button will update the state each time we click it
                new Button(new Text("Click me!"))
                    .addHandlerFor("click", () => {
                        // `this.state` is the class that has got methods `get` and `set`
                        // if you want the state to automatically update, you have to use them
                        this.state.set(
                            {
                                "clickedTimes": this.state.get("clickedTimes") + 1
                            }
                        );
                    })
            ])
        )
    }
}
```

Once you have rebuilt the project, you are going to see in the browser the text and the button under it. Each time you click a button the text updates and shows current counter value.
You can use states to make it easier to update information on the page when button clicked, changed the value of the textbox etc.

### Resources
[Bon UI Boilerplate](https://github.com/teplovs/bon-ui-boilerplate)
