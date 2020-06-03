//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

function clearPreviousLine () {
    process.stdout.moveCursor(0, -1)
    process.stdout.cursorTo(0)
    process.stdout.clearLine()
}

exports.clearPreviousLine = clearPreviousLine

