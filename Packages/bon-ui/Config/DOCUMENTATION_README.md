# Bon UI
A framework with declarative syntax for developing UI for web apps

## Features
### Component-based
You can build your own reusable components or use built-in.
```javascript
export class Feature extends View {
    constructor({ heading, description, code }) {
        super()
        this.heading = heading
        this.description = description
        this.code = code
    }

    getBody() {
        var { code, heading, description } = this

        return (
            new VStack([
                heading
                    .setFont(Fonts.title.with({ weight: Weight.bold }))
                    .setOffset({ bottom: 20 }),
                description
                    .setOffset({ bottom: 20 }),
                code
            ])
                .setPadding({ all: 10 })
        )
    }
}
```

### Declarative syntax
With Bon UI it is very easy to create dynamic and interactive user interfaces. Declarative syntax helps you to navigate in code and to easily understand what it does.
```javascript
class Header extends View {
    getBody () {
        return (
            new VStack([
                new Image("./Images/bon-ui.png", "Logo")
                    .setSize({ width: 200, height: 200 })
                    .setFitType(FitType.contain),
                new Text("Bon UI")
                    .setFont(Fonts.largeTitle)
                    .setOffset({ top: 10, bottom: 10 })
                    .setForeground({ color: Colors.orange }),
                new Text("A new framework\nfor developing web applications")
                    .setAlignment(Alignment.center)
            ])
                .setAlignment({ horizontal: Alignment.center, vertical: Alignment.center })
                .setMinSize({ height: viewportHeight(100) })
        )
    }
}
```

### States system
Each component has it's own state. When you update the state, the reconciler will automaticly update the DOM.
```javascript
class App extends View {
    getInitialState() {
        return { counter: 1 }
    }

    getBody() {
        return (
            new VStack([
                new Text("Increment the counter by clicking the button!")
                    .setOffset({ bottom: 20 }),
                
                new Button(new Text("Counter: " + this.state.get("counter").toString()))
                    .setHandlerFor({ event: "click", handler: event => {
                        this.state.set("counter", this.state.get("counter") + 1)
                    }})
            ])
        )
    }
}
```

## Getting started with Bon UI
There is a Medium post that describes how to work with Bon UI. You can read it [here](https://link.medium.com/zuF8phk864)

## Important notes
- Documentation is in development
- This is the alpha version of framework
- Please, contact us if you wish us to add something to the framework or found a bug
