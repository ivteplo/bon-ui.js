<h1 align="center">
    Bon UI
</h1>

<div align="center">
    <img src="logo.png" alt="Bon UI logo" height="150">
</div>

<div align="center">
    <strong>A framework with declarative syntax for developing UI for web apps</strong>
</div>

<div align="center">
    <!-- Current version on NPM -->
    <a href="https://npmjs.org/package/@teplovs/bon-ui">
        <img src="https://img.shields.io/npm/v/@teplovs/bon-ui?style=for-the-badge" alt="Latest avaliable version on NPM">
    </a>
    <!-- Bundle size -->
    <a href="https://npmjs.org/package/@teplovs/bon-ui">
        <img src="https://img.shields.io/bundlephobia/min/@teplovs/bon-ui?style=for-the-badge" alt="Bundle size of the latest avaliable version on NPM">
    </a>
    <!-- Downloads -->
    <a href="https://npmjs.org/package/@teplovs/bon-ui">
        <img src="https://img.shields.io/npm/dt/@teplovs/bon-ui?style=for-the-badge" alt="Downloads count">
    </a>
</div>

## Table of contents
- [Features](#features)
- [Installation](#installation)
    * [Using Package Manager](#using-package-manager)
    * [Using CDN](#using-cdn)
    * [Using Github Releases](#using-github-releases)
- [Documentation](#documentation)
- [Important notes](#important-notes)
- [Special thanks](#special-thanks)

## Features
### Component-based
You can build your own reusable components or use built-in.
```javascript
class Feature extends View {
    body() {
        return (
            new VStack([
                new Text(this.options.title)
                    .font(Fonts.title)
                    .offset({ bottom: 20 }),

                this.options.description
                    .offset({ bottom: 20 })
            ])
                .padding({ all: 10 })
        )
    }
}
```

### Declarative syntax
With Bon UI it is very easy to create dynamic and interactive user interfaces. Declarative syntax helps you to navigate in code and to easily understand what it does.
```javascript
class Header extends View {
    body () {
        return (
            new VStack([
                new Image(config.logo)
                    .size({ width: 200, height: 200 })
                    .fitType(FitType.contain),
                new Text(config.mainTitle)
                    .font(Fonts.largeTitle)
                    .offset({ top: 10, bottom: 10 })
                    .foreground({ color: Colors.orange }),
                new Text(config.description)
                    .alignment(Alignment.center)
            ])
                .alignment({ both: Alignment.center })
                .minSize({ height: viewportHeight(100) })
        )
    }
}
```

### States system
Each component has it's own state. When you update the state, the reconciler will automaticly update the DOM.
```javascript
class AppView extends View {
    initialState() {
        return { counter: 1 }
    }

    body() {
        return (
            new VStack([
                new Text("Increment the counter by clicking the button!")
                    .offset({ bottom: 20 }),
                
                new Button(
                    new Text("Counter: " + this.state.get("counter"))
                )
                    .handle("click", event => {
                        this.state.set({
                            counter: this.state.get("counter") + 1
                        })
                    })
            ])
        )
    }
}
```

## Installation
### Using Package Manager
If your project uses project manager like npm or yarn, you can run:
`npm install @teplovs/bon-ui --save` (`yarn add @teplovs/bon-ui` if you use yarn)
### Using CDN
You can use CDN like unpkg to use Bon UI on your website.
There are different URLs depending on which module type you need:
- UMD module: [https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.umd.js](https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.umd.js)
- ES6 module: [https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.esm.js](https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.esm.js)
- CommonJS module: [https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.cjs.js](https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.cjs.js)

To add the latest Bon UI version using `<script>` tag, add this to your HTML file:
```html
<script src="https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.umd.js" crossorigin="anonymous"></script> 
```
You can download the ES6 or CommonJS module using `curl` or `wget`:

`$ curl https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.esm.js --output BonUI.js`

`$ wget https://unpkg.com/@teplovs/bon-ui/Distribution/BonUI.esm.js --output-file BonUI.js`

(here you can replace URL with any of specified before)
### Using Github Releases
Inside the [repository releases section](https://github.com/teplovs/bon-ui/releases) you can find Bon UI releases. Here are some bundles with different module types like CommonJS, UMD and ES6.

## Documentation
You can find the API documentation by visiting [this](https://teplovs.github.io/bon-ui-docs) website.

More tutorials will be created soon. Stay tuned :)

## Important notes
- This is the alpha version of framework
- Please, contact us if you wish us to add something to the framework or found a bug

## Special thanks
Special thanks to:
- Ann-Cathrin Klose for writing [post about Bon UI in German on entwickler.de](https://entwickler.de/online/javascript/bon-ui-framework-react-579930406.html) (the first post written by other developers)

