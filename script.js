var defaultColors = [`red`, `blue`, `gold`, `green`];
var customColors = []; //For users to choose 4 custom colors for the UNO cards
const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `+2`]
//The card pile that players can get cards from.
var cardPile = [];
var playerDeck = [];
var computerDeck = [];
var cardInPlay = [];
var playerName = null;
var currentPlayer = null;
var selectedColor = null


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
    drawCards(7, computerDeck);
    var starterCard = cardPile.splice(getRandomInt(cardPile.length), 1);
    cardInPlay.push(starterCard[0]);
    renderCardInPlay();
    currentPlayer = 'user';
    var latestCardSpan = document.getElementById('latest-card')
    latestCardSpan.innerHTML = `${starterCard[0].color} ${starterCard[0].value}`
}


function handleCardClick() {

  //If colorPicker div is not hidden, hide it.
  if (!colorPicker.classList.value.includes('hide')) {
    toggleDisplay(colorPicker);
  }

    if (currentPlayer === 'user') {
        var playerCardValues = this.id.split("-")
        var playerType = playerCardValues[0]
        var playerColor = playerCardValues[1]
        var playerValue = playerCardValues[2]
        var playerIndex = playerCardValues[3]

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
            index: playerIndex
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
  deck.splice(card.index, 1)
  var latestCardSpan = document.getElementById('latest-card')
  latestCardSpan.innerHTML = `${card.color} ${card.value} from ${currentPlayer}`

    if (card.value === '+2' && deck === playerDeck) {
        drawCards(2, computerDeck);
        nextPlayer();
    } else if (card.value === '+4' && deck === playerDeck) {
        drawCards(4, computerDeck)
        nextPlayer();

    } else if (card.value === '+2' && deck === computerDeck) {
        drawCards(2, playerDeck)
        nextPlayer();

    } else if (card.value === '+4' && deck === computerDeck) {
        drawCards(4, playerDeck)
        nextPlayer();
    } else if (card.value === 'skip' && deck === playerDeck) {
        //Computer does not get their turn. User should be able to play another card.
    } else if (card.value === 'skip' && deck === computerDeck) {
        //Computer should then make a move.
    } else {
      nextPlayer();
    }
    //Just realised that Reverse cards don't really have an effect unless there are more than 2 players.

    renderCardInPlay();
    renderPlayerDeck();
    renderComputerDeck();
}

function nextPlayer(){
  if (currentPlayer==='user') {
    currentPlayer = 'computer'
    setTimeout(computerMove, 2000);
  } else if (currentPlayer==='computer') {
    currentPlayer = 'user'
  }
}

function drawCards(numOfCards, deck) {
    console.log(`draw cards triggered, draw ${numOfCards}`);

    for (var i = 0; i < numOfCards; i++) {
        var randomIndex = getRandomInt(cardPile.length)
        var randomCard = cardPile[randomIndex];
        deck.push(randomCard);
        cardPile.splice(randomIndex, 1);
    }
}

//comDeck is the array of opponent's cards eg computerDeck
function computerMove() {
    var moveWasMade = false
    for (var i = 0; i < computerDeck.length; i++) {
        var card = computerDeck[i]
        var validMove = checkValidMove(card)
        if (validMove) {
            playThisCard(card, computerDeck);
            renderComputerDeck();
            renderCardInPlay();
            return moveWasMade = true;
        }
    }
    if (!moveWasMade) {
        drawCards(1, computerDeck);
        renderComputerDeck();
    }
}


//Start game first for easier debugging.
generateDeck(defaultColors);
givePlayersDeck(7);
renderComputerDeck();
renderPlayerDeck();
