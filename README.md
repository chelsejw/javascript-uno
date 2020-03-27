# javascript-uno
replicating uno with javascript

// Write a function to generate an array of 108 UNO card objects.
var deckArray = [];
// Example of Uno Card:
var unoCard = {
    type: `number / action / wild`,
    color: `red/blue/green/yellow`,
    value: `1-9/skip/reverse/draw-2/draw-4/change-color
`
}
WHAT SHOULD BE RENDERED THE DOM AFTER GAME STARTS/EVERY TURN: (write a function for this)
- Player's deck.
- Computer's deck (Generate backOfCards images * computerDeck.length)
- Game Status display div
- Latest card in cardsInPlay array.
// Get 7 random card objects from deckArray, push it into playerArray / computerArray, and remove it from deckArray.
// Render cards to player 1 as HTML elements.
//Add CSS classes  according to the type/color/value of the cards
//The player cards should be clickable, and trigger a validMove function to check if it can be played.
var currentPlayer = null
// Randomize who starts first.
Start off with an empty CardsInPlay array.
function validMove(chosenCard) {
    var lastCardPlayed = cardsInPlay.pop();
    if (chosenCard.type === 'wild') {
        var chosenColor = prompt('choose a color');
        chosenCard.color = chosenColor
        cardsInPlay.push(chosenCard);
    } else if ((chosenCard.type === "number/action" && chosenCard.colorOrValue === lastCardPlayed.colororvalue) || (chosenCard.type === wildcard)) {
        cardsInPlay.push(chosenCard)
    }
}
function cardAction(chosenCard) {
    if (chosenCard.value === 'draw-2') {
        add 2 random cards from the deckArray to notCurrentPlayer,
    } else if (chosenCard.type === 'skip') {
        display latest move =  `Skipped ${notCurrentPlayer}'s turn!'`
        return;
    } else if (chosenCard.type === 'wild') {
    }
}
//Write a function to drawCard() from deckArray.
// If currentPlayer = computer then play a randomCard from computerArray, if no cards playable, then drawCard()
// Win conditions: playerArray / computerArray is empty (array.length === 0)
// Bonus: when playerArray reaches 1, generate a "Say UNO!" button.
// Player has 10 second countdown to click a "Say UNO!" button, if not, draw 4 cards from deckArray.
//Bonus: scoreboard?
//Bonus: Can choose how many computer players up to 3 other computer players.
// Things to take note:
// If deckArray gets to a very low number, draw 2 / draw 4 functions might not work.
// If deckArray is empty, and both users cannot successfully fulfil validMove with remaining cards, game ends in a draw?
