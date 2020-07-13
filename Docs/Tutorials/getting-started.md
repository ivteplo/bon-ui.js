
## Creating a project

Let's create a project called `HelloWorld`. It will have the following structure:
```
HelloWorld
|-- HelloWorld
    |-- App.js
    |-- package.json
    |-- Views
        |-- Content.js
```

> We create folder HelloWorld inside the root of the project because in the future project can have unit tests, UI tests etc.

To create this structure using bash, run:
```bash
mkdir -p HelloWorld/HelloWorld/Views
cd HelloWorld/HelloWorld
touch App.js Views/Content.js
```

Initialize the npm package:
```bash
npm init
# or if you prefer yarn:
yarn init
```

## Installing Bon UI as the dependency

To use Bon UI in a project, you have to add it as the dependency. To do that, you have to run the following command:
```bash
# in folder `HelloWorld/HelloWorld`:
npm install @teplovs/bon-ui --save
# or, again, if you prefer yarn:
yarn add @teplovs/bon-ui
```

## Creating the first view

Our next step is creating the first view. Views are very important things in Bon UI. They are used to represent items on the screen.

To create a simple view that will show text "Hello World!", write the following code in `HelloWorld/HelloWorld/Views/Content.js`:
```javascript
import { View, Text } from "@teplovs/bon-ui"

export class Content extends View {
    // Each view has to implement the body getter. If it's not implemented, Bon UI will throw an error.
    // Body getter has to return another view or virtual DOM node.
    // You will learn about virtual DOM nodes a bit later.
    get body () {
        return (
            new Text("Hello World!")
        )
    }
}
```

## Creating the `Application` instance

`Application` is the class that manages almost everything related to the app. It is used for changing scenes, loading and setting up the app, works with application renderers and so on.

Let's create our `App` class in `HelloWorld/HelloWorld/App.js`:
```javascript
import { Application, Scene } from "@teplovs/bon-ui"
import { Content } from "./Views/Content.js"

class App extends Application {
    // Like the view, Application has body getter. It returns an array of scenes. 
    // Each application has it's main scene. Main scene name is specified in the static 
    // property of the class. By default it is equal to "main".
    get body () {
        return [
            // Each scene has it's name and a view
            new Scene("main", new Content())
        ]
    }
}

// to run the app, you just have to call the static method `App.main`:
App.main()
```

## Building our app
__@todo__
