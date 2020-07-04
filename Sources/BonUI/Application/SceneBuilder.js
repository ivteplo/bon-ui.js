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
        
        const sceneNode = new VNode("bon-ui-scene", {
            attributes: {
                id: `${scene.name}-scene`
            },
            body: [
                view.controller.vNode
            ]
        })

        return sceneNode
    }
}
