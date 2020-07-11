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

/**
 * @category Exceptions
 */
export class NotImplementedException extends CustomError {}
/**
 * @category Exceptions
 */
export class InvalidValueException extends CustomError {}
/**
 * @category Exceptions
 */
export class ViewControllerException extends CustomError {}
/**
 * @category Exceptions
 */
export class SceneNotFoundException extends CustomError {}
/**
 * @category Exceptions
 */
export class SceneNotLoadedException extends CustomError {}
