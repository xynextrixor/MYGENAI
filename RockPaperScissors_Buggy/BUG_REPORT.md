# Rock Paper Scissors Bug Report

This sample project intentionally contains a few bugs to test a code review agent.

## Expected issues

- The result text element id does not match the HTML.
- The winner message uses the wrong status value.
- The game does not update the score on a win correctly.

## Additional intentional bugs added

- `index.html`: buttons have misspelled `data-choice` values (e.g. `rok`, `papr`, `scissrs`).
- `index.html`: script now points to `game.min.js` (file does not exist).
- `style.css`: stylesheet intentionally malformed (misspelled property, selector mismatch, unclosed comment) so styles may not apply.
- `game.js`: choices array includes `rok` (typo) and random index calculation has an off-by-one error.
- `game.js`: button selector changed to `.choice-btns` so event listeners won't attach.
- `game.js`: `playerScore` initialized as a string which causes incorrect score arithmetic.
- `game.js`: `getResult` returns `won` but `playRound` checks for `win`.
