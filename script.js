var defaultColors = [`red`, `blue`, `gold`, `green`];
var playerName = null;
var unoColors = null;
var customColors = []; //For users to choose 4 custom colors for the UNO cards
const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `+2`]
var cardPile = [];
var playerDeck = [];
var computer1Deck = [];
var computer2Deck = [];
var cardInPlay = [];

var computerPlayerIndex = null

var playerName = null;
var selectedColor = null;

playerName = 'Chelsea'

var orderOfPlayers = [playerName, `Computer 1`, `Computer 2`]
var indexOfLastPlayer = orderOfPlayers.length - 1
var playerIndex = 0;
var currentPlayer = orderOfPlayers[playerIndex];
var nextPlayer = null;

var currentPlayerDisplay = document.getElementById('current-player')
var drawBtn = document.getElementById('drawcard-btn')
drawBtn.addEventListener('click', drawOne)

function drawOne() {
    drawCards(1, playerDeck);
    changePlayer();
    renderPlayerDeck();
    showCurrentPlayer();
}

var colorPicker = document.querySelector('.color-picker')

//color choices should be an ARRAY of four colors that are valid CSS color codes/names.
function generateDeck(colorChoices) {
    //Generate numbercards 1-9 in 4 colors. (36 cards)
    for (var colorIndex = 0; colorIndex < colorChoices.length; colorIndex++) {
        var currentColor = colorChoices[colorIndex];
        //For the 4 colors, generate 1 x Number 0 card for each color.
        var colorCard0 = {
            type: `color`,
            color: currentColor,
            value: 0,
            indexInDeck: null
        }
        cardPile.push(colorCard0);
        //For color cards 1-9 & skip/draw2/reverse, generate 2 each.
        for (var valueIndex = 0; valueIndex < colorCardValues.length; valueIndex++) {
            var colorCards = {
                type: `color`,
                color: currentColor,
                value: colorCardValues[valueIndex],
                indexInDeck: null

            }
            cardPile.push(colorCards)
            cardPile.push(colorCards)
        }
    }

    //Generate the wildcards: draw 4 & chooseColor.
    for (var cardCount = 0; cardCount < 4; cardCount++) {
        var wildDraw4 = {
            type: `wild`,
            color: "",
            value: `+4`,
            indexInDeck: null
        }
        var wildColor = {
            type: `wild`,
            color: "",
            value: `wild`,
            indexInDeck: null
        };
        cardPile.push(wildDraw4);
        cardPile.push(wildColor);
    }
    return cardPile;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function givePlayersDeck(num) {
    drawCards(7, playerDeck);
    drawCards(7, computer1Deck);
    drawCards(7, computer2Deck);
    var starterCard = cardPile.splice(getRandomInt(cardPile.length), 1);

    if (starterCard[0].type === 'wild') {
        var randomColorIndex = getRandomInt(3);
        var randomColor = defaultColors[randomColorIndex];
        starterCard[0].color = randomColor
    }

    cardInPlay.push(starterCard[0]);
    renderCardInPlay();
    currentPlayer = playerName;
    displayLatestMove(`${starterCard[0].color} ${starterCard[0].value}`);
    showCurrentPlayer();
    nextPlayerDisplay();

    var deckName = document.querySelectorAll('.user-name')
    for (var i = 0; i < deckName.length; i++) {
        deckName[i].innerText = playerName;
    }
}

function displayLatestMove(value) {
    var latestMoveSpan = document.getElementById('latest-move');
    latestMoveSpan.innerText = value;
}

function showCurrentPlayer() {
    currentPlayerDisplay.innerText = currentPlayer;
}


function handleCardClick() {

    //If colorPicker div is not hidden, hide it.
    if (!colorPicker.classList.value.includes('hide')) {
        toggleDisplay(colorPicker);
    }

    if (currentPlayer === playerName) {
        var playerCardValues = this.id.split("-")
        var playerType = playerCardValues[0]
        var playerColor = playerCardValues[1]
        var playerValue = playerCardValues[2]
        var playerIndex = parseInt(playerCardValues[3])

        //If player value +2 or +4 (these are considered numbers), do not parseInt. Else if it's a number, parseInt.
        if (playerValue === `+2` || playerValue === `+4`) {
            playerValue;
        } else if (!isNaN(playerValue)) {
            playerValue = parseInt(playerValue)
        }
        var playerCard = {
            type: playerType,
            color: playerColor,
            value: playerValue,
            indexInDeck: playerIndex
        }
        var latestCard = getLatestCard()
        var latestColor = latestCard.color;
        var latestType = latestCard.type;
        var latestValue = latestCard.value;

        //If player card is wild, it will always be playable, so no need to check.
        if (playerType === `wild`) {
            //Unhide color picker div and render color buttons.
            renderWildColorPicker();
            toggleDisplay(colorPicker);
            //Add event listener to the confirm button.
            var confirmBtn = document.getElementById('confirm');
            confirmBtn.addEventListener('click', function(event) {
                //If selectedColor (global var) is not null, then assign the selectedColor to wildcard and play it, hide the colorpicker div, then remove value from selectedColor for future wildcards.
                if (selectedColor) {
                    playerCard.color = selectedColor;
                    playThisCard(playerCard, playerDeck);
                    toggleDisplay(colorPicker);
                    selectedColor = null;
                } else {
                    console.log(`Color is not selected yet.`)
                }
            });
        } else {
            //If the card is not a wild card, we have to check for valid move.
            var validMove = checkValidMove(playerCard)
            //If the card is a valid move, then play the card.
            if (validMove) {
                playThisCard(playerCard, playerDeck)
                //If not, error message.
            } else {
                console.log(`can't play this card`)
            }
        }
    }
};

//this function assigns the selected color icon's id to the selectedColor global variable
var colorPicked = function() {
    selectedColor = this.id;
}


function checkValidMove(card) {
    var latestCard = getLatestCard()
    var latestColor = latestCard.color;
    var latestType = latestCard.type;
    var latestValue = latestCard.value;

    if (card.value === latestValue) {
        return true
    } else if (card.color === latestColor) {
        return true
    } else {
        return false
    }
}

//Function moves a card from someone's deck & sets it as the CardInPlay
//"card" should be a card object with an index key, and deck is player/computer deck array
function playThisCard(card, deck) {
    cardInPlay.push(card);
    deck.splice(card.indexInDeck, 1)
    displayLatestMove(`${card.color} ${card.value} from ${currentPlayer}`)

    if (card.value === '+2') {
        drawCards(2, nextPlayer);
    } else if (card.value === '+4'){
        drawCards(4, nextPlayer)
    } else if (card.value === 'skip') {
        changePlayer();
    } else if (card.value==='reverse'){
        //write a function to reverse array of orderOfPlayers
    }

    changePlayer();
    nextPlayerDisplay();
    renderCardInPlay();
    renderPlayerDeck();
    renderComputerDeck(1);
    renderComputerDeck(2);
    showCurrentPlayer();

    if (currentPlayer==='Computer 1') {
      computerPlayerIndex = 1
      setTimeout(computerMove, 3000)
    } else if (currentPlayer==='Computer 2'){
      computerPlayerIndex = 2
      setTimeout(computerMove, 3000)
    }

    var winner = checkWin();
    if (winner) {
        alert(`${winner} has won the game!`)
    }

}

function changePlayer(){
    if (playerIndex === indexOfLastPlayer) {
        playerIndex = 0;
    } else {
        playerIndex++;
    }
    return currentPlayer = orderOfPlayers[playerIndex];
}

function nextPlayerDisplay(){
  if (playerIndex===indexOfLastPlayer) {
    nextPlayer = orderOfPlayers[0];
  } else {
    nextPlayer = orderOfPlayers[playerIndex + 1]
  }

  var nextPlayerDiv = document.getElementById('next-player')
  nextPlayerDiv.innerText = nextPlayer;
}

function drawCards(numOfCards, deck) {
    console.log(`draw cards triggered, draw ${numOfCards}`);

    for (var i = 0; i < numOfCards; i++) {
        var randomIndex = getRandomInt(cardPile.length)
        var randomCard = cardPile[randomIndex];
        deck.push(randomCard);
        cardPile.splice(randomIndex, 1);
    }

    if (cardPile.length < 5) {
        shuffleCardPile();
    }
}

function shuffleCardPile() {
    console.log(`before: cardInPlay = ${cardInPlay.length}`)
    console.log(`before: cardPile = ${cardPile.length}`)

    //Remove the latest card from the cards in play
    var latestCard = cardInPlay.pop();
    console.log(`latest card = ${latestCard}`)
    //Get a random card from the cards left in cardInPlay, and put it back into the pile.
    var currentLength = cardInPlay.length
    for (var i = 0; i < currentLength; i++) {
        var randomIndex = getRandomInt(cardInPlay.length);
        var randomCard = cardInPlay[randomIndex];
        cardPile.push(randomCard);
        cardInPlay.splice(randomIndex, 1);
    }

    cardInPlay.push(latestCard);
    console.log(`after: cardInPlay = ${cardInPlay.length}`)
    console.log(`after: cardPile = ${cardPile.length}`)
}


function getRandomItem(arr) {
    var randomIndex = getRandomInt(arr.length - 1);
    var randomItem = arr[randomIndex];
    return randomItem;
}

//comDeck is the array of opponent's cards eg computerDeck
function computerMove() {
    var computerDeck;
    if (computerPlayerIndex === 1) {
        computerDeck = computer1Deck;
    } else if (computerPlayerIndex === 2) {
        computerDeck = computer2Deck;
    }
    var moveWasMade = false;
    var deckColors = []
    var onlyWildCards = true;
    //First reassign an indexInDeck value for all the cards.
    for (var i = 0; i < computerDeck.length; i++) {
        var card = computerDeck[i]
        card.indexInDeck = i; //Assign index
        if (card.type !== "wild") {
            onlyWildCards = false;
            deckColors.push(card.color) //Track only the non-wild cards in the totalColors array.
        }
    }

    //Then loop through and check for valid move.
    for (var i = 0; i < computerDeck.length; i++) {
        var card = computerDeck[i]

        var validMove = checkValidMove(card)
        if (validMove) {
            playThisCard(card, computerDeck);
            renderComputerDeck(1);
            renderComputerDeck(2);
            renderCardInPlay();
            return moveWasMade = true;
        } else if (card.type === 'wild') {
            //If the deck only has wild cards, select a random color from the default colors.
            if (onlyWildCards) {
                randomColor = getRandomItem(defaultColors);
                //Else if the deck has color cards as well, select a random color from the deck's colors.
            } else {
                randomColor = getRandomItem(deckColors);
            }
            //Assign the card the randomColor, then play it.
            card.color = randomColor;
            playThisCard(card, computerDeck);
            renderComputerDeck(1);
            renderComputerDeck(2);
            renderCardInPlay();
            return moveWasMade = true;
        }
    }

    if (!moveWasMade) {
        drawCards(1, computerDeck);
        displayLatestMove(`Computer drew a card`)
        renderComputerDeck(1);
        renderComputerDeck(2);
        changePlayer();
        showCurrentPlayer();
    }
}


function checkWin() {
    if (computerDeck.length === 0) {
        currentPlayer = null;
        return `computer`
    } else if (playerDeck.length === 0) {
        currentPlayer = null;
        return `user`
    }
}


//Start game first for easier debugging.
generateDeck(defaultColors);
givePlayersDeck(7);
renderComputerDeck(1);
renderComputerDeck(2);
renderPlayerDeck();
