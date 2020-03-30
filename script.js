var defaultColors = [`red`, `blue`, `gold`, `green`];
var customColors = []; //For users to choose 4 custom colors for the UNO cards
const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `+2`]
//The card pile that players can get cards from.
var cardPile = [];
var playerDeck = [];
var computerDeck = [];
var cardInPlay = [];

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
    var deckLength = num;

    for (var i = 0; i < deckLength; i++) {
        var randomIndex1 = getRandomInt(cardPile.length)
        var randomCard1 = cardPile[randomIndex1];
        playerDeck.push(randomCard1);
        cardPile.splice(randomIndex1, 1);
        var randomIndex2 = getRandomInt(cardPile.length)
        var randomCard2 = cardPile[randomIndex2];
        computerDeck.push(randomCard2)
        cardPile.splice(randomIndex2, 1);
    }
    var starterCard = cardPile.splice(getRandomInt(cardPile.length), 1);
    cardInPlay.push(starterCard[0]);
    renderCardInPlay(cardInPlay);
}


function handleCardClick() {
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

    if (playerType === `wild`) {
      console.log(`At stage: checking player type, isColorSelected = ${isColorSelected}`)

        var isColorSelected = false
        renderWildColorPicker();
        toggleDisplay(colorPicker);
        var chosenColor = colorPicked;
        var confirmed = confirmWildColor;
        if (confirmed) {
          playerCard.color = colorPicked;
          playThisCard(playerCard, playerDeck)
        }
    } else if (playerValue === latestValue) {
        cardInPlay = playerCard;
        playThisCard(playerCard, playerDeck)

    } else if (playerColor === latestColor) {
      playThisCard(playerCard, playerDeck)

    } else {
        console.log(`you can't play that card.`)
    }

}

var colorPicked = function () {
    isColorSelected = true;
    console.log(`At stage: colorPicked, isColorSelected = ${isColorSelected}`)
    return this.id;
}

var confirmWildColor = function() {
  console.log(`At stage: confirmWildColor(), isColorSelected = ${isColorSelected}`)

    if (isColorSelected) {
        return true;
    } else {
      console.log(`Color is not selected yet.`)
      return false;
    }
}

//Function moves a card from someone's deck & sets it as the CardInPlay
//"card" should be a card object with an index key, and deck is player/computer deck array
function playThisCard(card, deck) {
  cardInPlay.push(card)
  deck.splice(card.index, 1)
  renderCardInPlay();
  renderPlayerDeck();
}


//Start game first for easier debugging.
generateDeck(defaultColors);
givePlayersDeck(7);
renderComputerDeck();
renderPlayerDeck();
