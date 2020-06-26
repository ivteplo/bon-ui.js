//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

class CustomError extends Error {
    constructor (...msg) {
        super(...msg)
        this.name = this.constructor.name
    }
}

export class NotImplementedException extends CustomError {}
export class InvalidValueException extends CustomError {}
export class ViewControllerException extends CustomError {}
export class SceneNotFoundException extends CustomError {}
