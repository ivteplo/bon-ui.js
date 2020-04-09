//
// Config.js
// Created on 13/03/2020
//
// Copyright (c) 2020 Teplovs
// This file is under Apache License v2.0
// 
// See https://www.apache.org/licenses/LICENSE-2.0 for license information
// 

import { Color, Colors as BonUIColors, Fonts as BonUIFonts } from "../../Sources/BonUI"

export const appTitle = "Bon UI Test"

export const Colors = {
    lightGray: new Color({ red: 0xCC, green: 0xCC, blue: 0xCC }),
    orange: new Color({ red: 0xff, green: 0x66, blue: 0x00 }),
    brown: new Color({ red: 0x80, green: 0x33, blue: 0x00 }),
    black: BonUIColors.black,
    white: BonUIColors.white
}

const systemFonts = 'apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'

export const Fonts = { 
	default: BonUIFonts.default.with({ name: systemFonts }), 
	title: BonUIFonts.title.with({ name: systemFonts }), 
	largeTitle: BonUIFonts.largeTitle.with({ name: systemFonts }), 
	subheading: BonUIFonts.subheading.with({ name: systemFonts }), 
	monospace: BonUIFonts.monospace
}
