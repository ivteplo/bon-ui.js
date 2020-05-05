import { percents, viewportHeight, viewportWidth, fontSize, Colors, Fonts, Color, OutlineStyle, Alignment, View, Text, VStack, HStack, Length, Button } from "@teplovs/bon-ui"
import { CalculatorTop, CalculatorBottom, CalculatorRow, CalculatorButton, selectionColor, useSelectionColor, buttonSize, buttonOffset } from "./Calculator"

const buttonRows = {
    top: [
        [ "deg", "rad" ],
    ],
    bottom: [
        [ "sin", "cos" ],
        [ "tg", "ctg" ],
        [ "arcsin", "arccos" ],
        [ "log2", "log10" ],
        [ "ln", "" ]
    ]
}

export class CalculatorExtensionPanel extends View {
    getBody () {
        return (
            new VStack([
                new CalculatorTop([
                    ...buttonRows.top.map(row => (
                        new CalculatorRow([
                            ...row.map(item => (
                                new CalculatorButton(String(item), () => this.options.handleButtonClick(item))
                                	.setSize({ width: new Length(buttonSize.value * 2, buttonSize.measure) })
                            ))
                        ])
                            .setAlignment({ horizontal: Alignment.start })
                    ))
                ], Alignment.start),
                new CalculatorBottom([
                    ...buttonRows.bottom.map(row => (
                        new CalculatorRow([
                            ...row.map(item => (
                                new CalculatorButton(String(item), () => this.options.handleButtonClick(item))
                                	.setSize({ width: new Length(buttonSize.value * 2, buttonSize.measure) })
                            ))
                        ])
                            .setAlignment({ horizontal: Alignment.start })
                    ))
                ], Alignment.start)
            ])
                .setSize({ height: percents(100) })
                .setBackground({ color: selectionColor })
                .applyViewProperties(this)
        )
    }
}

