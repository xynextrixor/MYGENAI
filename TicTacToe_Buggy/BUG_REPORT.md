# Tic Tac Toe Game - Code Review Exercise

## Overview

This is a tic-tac-toe game with **intentional bugs** for code review practice. Your task is to identify and fix all the bugs.

## Known Bugs (Hints for Code Review)

### Bug #1: Missing Cell Validation

**Location:** `makeMove()` method
**Issue:** The code doesn't check if a cell is already occupied before allowing a move
**Impact:** Players can overwrite moves

### Bug #2: Missing Empty Cell Check

**Location:** `makeMove()` method
**Issue:** No validation that the selected cell is empty
**Impact:** Game logic breaks when cells are clicked multiple times

### Bug #3: Wrong Win Checking Logic

**Location:** `checkWin()` method
**Issue:** Includes invalid winning combinations [0,1,3] and [1,2,4]
**Impact:** Game declares false wins

### Bug #4: Player Switch Logic Issue

**Location:** `makeMove()` method
**Issue:** Player should only switch after a valid move, but current logic switches anyway
**Impact:** Player turns get out of sync

### Bug #5: Incomplete Win Combination Check

**Location:** `checkWin()` method
**Issue:** Loop only iterates through first 6 combinations instead of all 8 valid ones
**Impact:** Diagonal wins might not be detected

### Bug #6: CSS Class Assignment Bug

**Location:** `updateDisplay()` method
**Issue:** X pieces get 'o' class and O pieces get 'x' class (reversed)
**Impact:** Styling colors are inverted

### Bug #7: Board State Not Properly Reset

**Location:** `reset()` method
**Issue:** Some state might not be properly cleared
**Impact:** Game may behave unexpectedly after reset

### Bug #8: Event Listener Timing

**Location:** Bottom of game.js
**Issue:** Using DOMContentLoaded might be redundant since script is loaded after HTML
**Impact:** Minor - but good practice consideration

---

## Assignment

1. Identify all the bugs in the code
2. Document what each bug causes
3. Fix all the bugs
4. Test the game to ensure it works correctly
5. Create a fixed version

## How to Test

1. Open `index.html` in a web browser
2. Try to play the game and observe the bugs
3. Attempt to win and see how the buggy win detection behaves

Good luck with your code review!
