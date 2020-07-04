//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { ViewBuilder } from "../Views/ViewBuilder.js"
import { VNode } from "../../VirtualDOM/VNode.js"
import { Scene } from "./Scene.js"

export class SceneBuilder {
    /**
     * 
     * @param {Scene} scene 
     */
    static build (scene) {
        const { view } = scene
        ViewBuilder.build(view, { save: true })
        
        const sceneNode = new VNode("div", {
            attributes: {
                id: `${scene.name}-scene`,
                class: "application-scene"
            },
            styles: {
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            },
            body: [
                view.controller.vNode
            ]
        })

        return sceneNode
    }
}
