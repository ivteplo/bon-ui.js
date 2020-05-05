import { percents, viewportHeight, viewportWidth, fontSize, Colors, Fonts, Color, OutlineStyle, Alignment, View, Text, VStack, HStack, Button } from "@teplovs/bon-ui"
import { CalculatorTop, CalculatorBottom, CalculatorButton, CalculatorRow, Calculator, selectionColor } from "./Calculator"
import { CalculatorExtensionPanel } from "./CalculatorExtensionPanel"

const functions = [ "abs", "ln", "log2", "log10", "arcsin", "arccos", "sin", "cos", "ctg", "tg" ]

const functionFound = input => {
    for (let i in functions) {
        if (functions[i] === input.substr(-(functions[i].length))) {
            return functions[i]
        }
    }

    return false
}

export class AppView extends View {
    getInitialState () {
        return { 
            input: "", 
            editable: true, 
            degrees: localStorage.getItem("useDegrees") === "true", 
            extended: false 
        }
    }

    getBody() {
        return (
            new HStack([
                new Calculator({ 
                    input: this.state.get("input"),
                    degrees: this.state.get("degrees"), 
                    handleButtonClick: this.handleButtonClick.bind(this), 
                    extended: this.state.get("extended")
                })
                .applyCSS({ flexGrow: "1" }),

                this.state.get("extended") 
                    ?
                        new CalculatorExtensionPanel({
                            input: this.state.get("input"),
                            degrees: this.state.get("degrees"), 
                            handleButtonClick: this.handleButtonClick.bind(this)
                        })
                            .applyCSS({ flexGrow: "1" })
                    : null
            ])
                .setAlignment({ horizontal: Alignment.center })
                .setSize({ width: viewportWidth(100) })
                .setMinSize({ height: viewportHeight(100) })
                .setBackground({ color: selectionColor })
        )
    }

    handleButtonClick (button) {
        if (button === "C") {
            this.state.set({
                input: "", 
                editable: true 
            })
        } else if (this.state.get("editable")) {
            let input = this.state.get("input")

            switch (button) {
                case "<":
                    let fnName = functionFound(input)
                    if (fnName) {
                        input = input.slice(0, -fnName.length)
                    } else if (input.substr(-1) === "(") {
                        input = input.slice(0, -1)
                        fnName = functionFound(input)

                        if (fnName) {
                            input = input.slice(0, -fnName.length)
                        }
                    } else {
                        input = input.slice(0, -1)
                    }

                    this.state.set({ input })
                    break
                case "deg":
                case "rad":
                    localStorage.setItem("useDegrees", button === "deg")
                    this.state.set({
                        degrees: button === "deg"
                    })
                    break
                case ".":
                    let value = ""
                    let reversedInput = input.split("").reverse()

                    for (let i in reversedInput) {
                        if ([ "+", "-", "/", "*", "(", ")"].indexOf(reversedInput[i]) >= 0) {
                            break
                        }

                        value = reversedInput[i] + value
                    }

                    if (value.indexOf(".") >= 0) {
                        return
                    } else {
                        if (functionFound(input)) {
                            return
                        }
                    }

                    this.state.set({
                        input: input + "."
                    })
                    break
                case "π":
                case "(":
                    if (input.substr(-1) === ".") {
                        return
                    }

                    if ("+-*/(".indexOf(input.substr(-1)) === -1) {
                        input += "*"
                    }

                    this.state.set({ input: input + button })
                    break
                case ")":
                    if (input.substr(-1) === "(") {
                        return
                    }

                    let opened = 0

                    input.split("").forEach(value => {
                        if (value === "(") {
                            opened += 1
                        } else if (value === ")") {
                            opened -= 1
                        }
                    })

                    if (opened > 0) {
                        this.state.set({
                            input: input + ")"
                        })
                    }
                    break
                case "+":
                case "-":
                case "*":
                case "/":
                    if ((input.substr(-1) === "" && button !== "+" && button !== "-") || input.substr(-1) === "." || (input.substr(-1) === "(" && button !== "-")) {
                        return
                    } else if ("+-*/".indexOf(input.substr(-1)) >= 0) {
                        this.state.set({
                            input: input.slice(0, -1) + button
                        })
                    } else {
                        let functionFound = false
                        for (let i in functions) {
                            if (functions[i] === input.substr(-(functions[i].length))) {
                                functionFound = true
                                break
                            }
                        }

                        if (functionFound) {
                            return
                        }

                        this.state.set({
                            input: input + button
                        })
                    }
                    break
                case "=":
                    this.calculateValue()
                    break
                default:
                    if (functions.indexOf(button) >= 0) {
                        if (input.substr(-1) === ".") {
                            input = input.slice(0, -1)
                        }

                        if (input.substr(-1) !== "" && "+-*/(√".indexOf(input.substr(-1)) === -1) {
                            input += "*"
                        }

                        this.state.set({ 
                            input: input + button + "("
                        })
                    } else {
                        this.state.set({
                            input: input + button
                        })
                    }
                    break
            }
        }
    }
    
    calculateValue () {
        try {
            let input = this.state.get("input")
                .replace(/sin/g, "Math.sin")
                .replace(/cos/g, "Math.cos")
                .replace(/arcMath.sin/g, "Math.asin")
                .replace(/arcMath.cos/g, "Math.acos")
                .replace(/ctg/g, "1/Math.tan")
                .replace(/tg/g, "Math.tan")
                .replace(/π/g, "Math.PI")
                .replace(/ln/g, "Math.log")
                .replace(/log2/g, "Math.log2")
                .replace(/log10/g, "Math.log10")
                .replace(/abs/g, "Math.abs")
                .replace(/√(.*)/g, match => {
                    return `Math.sqrt(${match.substr(1)})`
                })

            if ("+-*/.".indexOf(input) >= 0) {
                return
            }

            if (this.state.get("degrees")) {
                input = input
                    .replace(/(Math.sin|Math.tan|Math.cos)\(((.?)[0-9])*\)/g, (match, func) => {
                        return match.substr(0, func.length) + "(Math.PI / 180 *" + match.substr(func.length) + ")"
                    })
                    .replace(/(Math.asin|Math.acos)\(((.?)[0-9])*\)/g, (match, func) => {
                        return "(180 / Math.PI * " + match + ")"
                    })
            }

            console.log(input)

            let evaluated = eval(input)
            this.state.set({
                input: evaluated.toString()
            })
        } catch (e) {
            this.state.set({
                input: "Error",
                editable: false
            })
        }
    }
}

