import { View, Text, VStack, HStack, List, ForEach, Colors, Fonts, Alignment, percents } from "../BonUI.js"

var colors = Object.keys(Colors)

export class AppView extends View {
    body () {
        return (
            new VStack([
                new Text("This is VStack")
                    .font(Fonts.largeTitle),
                


                new Text("Colors")
                    .offset({ top: 20 })
                    .font(Fonts.title),

                new ForEach(colors, color => (
                    new HStack([
                        new Text(color),
                        new View()
                            .size({ width: 50, height: 50 })
                            .background({ color: Colors[color] })
                    ]).alignment({ horizontal: Alignment.spaceBetween, vertical: Alignment.center })
                )),

                new Text("List")
                    .offset({ top: 20 })
                    .font(Fonts.title),

                new List([
                    new ForEach(new Array(3).fill(0), (_, index) => (
                        new Text("This is item #" + index)
                    ))
                ])
            ])
            .size({ width: percents(100) })
            .maxSize({ width: 600 })
            .padding({ all: 20 })
        )
    }
}
