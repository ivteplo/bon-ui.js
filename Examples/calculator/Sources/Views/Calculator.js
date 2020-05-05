import { percents, viewportHeight, viewportWidth, fontSize, Colors, Fonts, Color, OutlineStyle, Alignment, View, Text, VStack, HStack, Button } from "@teplovs/bon-ui"

const buttonBackground = Colors.darkGray.withAlpha(0.3)
const buttonRadius = fontSize(1.5)
const buttonTextSize = fontSize(1.3)
const buttonForeground = Colors.lightGray
const font = Fonts.default.with({ size: buttonTextSize })
export const buttonOffset = 15
export const buttonSize = fontSize(4)
export const selectionColor = new Color({ red: 0x29, green: 0x99, blue: 0x7f })

export function CalculatorTop (...args) {
    return (
        new CalculatorBottom(...args)
            .setBackground({ color: Colors.darkGray.withAlpha(0.3) })
            .setPadding({ top: buttonOffset * 2 })
    )
}

export function CalculatorBottom (children, horizontalAlignment = Alignment.center) {
    return (
        new VStack([
            new VStack([
                ...children
            ])
                .setSize({ width: percents(100), height: percents(100) })
                .setMaxSize({ width: 400 })
        ])
            .setSize({ width: percents(100) })
            .applyCSS({ boxSizing: "border-box" })
            .setAlignment({ horizontal: horizontalAlignment })
            .setPadding({ all: buttonOffset })
    )
}

export function CalculatorButton (text, handler) {
    return new Button(new Text(text))
        .setFont(font)
        .setOffset({ all: buttonOffset })
        .setForeground({ color: buttonForeground })
        .setSize({ width: buttonSize, height: buttonSize })
        .setOutline({ style: OutlineStyle.none, radius: buttonRadius })
        .setBackground({ color: buttonBackground })
        .addHandlerFor("click", handler)
}

export function CalculatorRow (buttons) {
    return new HStack([
        ...buttons.map(button => button.applyCSS({ flexGrow: 1 }))
    ])
        .setAlignment({ horizontal: Alignment.spaceBetween })
        .setOffset({ bottom: buttonOffset })
}

const buttonRows = {
    top: [ ],
    bottom: [
        [ "π", "e", "√", "abs" ],
        [ "C", "<", "(", ")" ],
        [ 7, 8, 9, "*" ],
        [ 4, 5, 6, "/" ],
        [ 1, 2, 3, "+" ],
        [ 0, ".", "=", "-"]
    ]
}

export class CalculatorInput extends View {
    getBody() {
        return (
            new HStack([
                new Text(this.options.input)
                    .setFont(font)
                    .setOffset({ left: buttonOffset, right: buttonOffset })
            ])
                .applyViewHandlers(this)
                .applyViewProperties(this)
                .applyCSS({ overflow: "hidden" })
                .setOutline({ radius: buttonRadius })
                .setForeground({ color: buttonForeground })
                .setBackground({ color: buttonBackground })
                .setAlignment({ horizontal: Alignment.start, vertical: Alignment.center })
        )
    }
}

export const useSelectionColor = (item, degrees) => (item === "deg" && degrees) || (item === "rad" && !degrees)

export class Calculator extends View {
    getBody () {
        return (
            new VStack([
                new CalculatorTop([
                    new CalculatorInput({ input: this.options.input })
                        .setOffset({ all: buttonOffset, bottom: buttonOffset * 2 })
                        .setSize({ height: buttonSize, width: null && percents(100) }),
                    ...buttonRows.top.map(row => (
                        new CalculatorRow([
                            ...row.map(item => (
                                new CalculatorButton(String(item), () => this.options.handleButtonClick(item))
                                    .setForeground({ color: useSelectionColor(item, this.options.degrees) ? selectionColor : null })
                            ))
                        ])
                    ))
                ], this.options.extended ? Alignment.end : undefined),
                new CalculatorBottom([
                    ...buttonRows.bottom.map(row => (
                        new CalculatorRow([
                            ...row.map(item => (
                                new CalculatorButton(String(item), () => this.options.handleButtonClick(item))
                            ))
                        ])
                    ))
                ], this.options.extended ? Alignment.end : undefined)
            ])
                .setAlignment({ horizontal: this.options.extended ? Alignment.end : Alignment.center })
                .setSize({ height: percents(100) })
                .applyViewProperties(this)
        )
    }
}

