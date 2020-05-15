//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const validateNpmPackageName = require("validate-npm-package-name")

exports.validateProjectName = function (projectName) {
    const validationResult = validateNpmPackageName(projectName)

    if (validationResult.validForNewPackages) {
        return { valid: true }
    }

    return {
        valid: false,
        problems: (validationResult.errors || []).concat(validationResult.warnings || [])
    }
}


