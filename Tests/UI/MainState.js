//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { State } from "../../esm/BonUI.development.js"

const initialState = {
    notes: []
}

export const mainState = new State((state = initialState, action) => {
    switch (action.type) {
        case "delete":
            {
                const { id } = action
                const newState = {...state}

                for (let i in newState.notes) {
                    if (newState.notes[i].id === id) {
                        newState.notes.splice(i, 1)
                        break
                    }
                }

                return newState
            }
        case "add":
            {
                const { title, date } = action
                const newState = {...state}

                let id = 0
                for (let note of state.notes) {
                    if (note.id >= id) {
                        id = note.id + 1
                    }
                }

                newState.notes.push({ id, title, date })
                return newState
            }
        default:
            let notes = []
            if (typeof localStorage === "object") {
                notes = localStorage.getItem("notes")

                if (notes) {
                    notes = JSON.parse(notes)
                } else {
                    notes = []
                }
            }

            return {
                ...state,
                notes
            }
    }
})

mainState.subscribe(() => {
    if (typeof localStorage === "object") {
        localStorage.setItem("notes", JSON.stringify(mainState.current.notes))
    }
})
