//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

const fs = require("fs")

exports.isFolderEmpty = function (folder) {
    try {
        const dirStream = fs.opendirSync(folder)
        if (dirStream.readSync() === null) {
            return true
        } else {
            return false
        }
    } catch (e) {
        return true
    }
}


