import { View, Text } from "@teplovs/bon-ui"

export class AppView extends View {
    getBody() {
        return (
            new Text("Hello world!")
        )
    }
}

