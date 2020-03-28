var defaultColors = [`red`, `blue`, `gold`, `green`];
const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `+2`]
//The card pile that players can get cards from.
var cardPile = [];
var playerDeck = [];
var computerDeck = [];
var cardInPlay = null;

var validMove = function() {

    var cardToMatch = cardInPlay[0]
    console.log(`this card is ${this.id}`)
    console.log(`card in play is ${cardToMatch}`);

}

function generateDeck(colorChoices) {
    //Generate numbercards 1-9 in 4 colors. (36 cards)
    for (var colorIndex = 0; colorIndex < colorChoices.length; colorIndex++) {
        var currentColor = colorChoices[colorIndex];

        //For the 4 colors, generate 1 x Number 0 card for each color.
        var colorCard0 = {
            type: `color`,
            color: currentColor,
            value: 0
        }
        cardPile.push(colorCard0);

        //For color cards 1-9 & skip/draw2/reverse, generate 2 each.
        for (var valueIndex = 0; valueIndex < colorCardValues.length; valueIndex++) {
            var colorCards = {
                type: `color`,
                color: currentColor,
                value: colorCardValues[valueIndex]
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
            value: `+4`
        }
        var wildColor = {
            type: `wild`,
            color: "",
            value: `wildColor`
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
    cardInPlay = starterCard[0]
    renderCardInPlay(cardInPlay);
}

function renderCardInPlay() {

var cardsInPlayDiv = document.getElementById('cards-in-play')
cardsInPlayDiv.innerText = "";

    var cardType = cardInPlay.type;
    var cardColor = cardInPlay.color;
    var cardValue = cardInPlay.value;

    var statusDisplay = document.createElement("h2");
    statusDisplay.id = "status-display";
    statusDisplay.innerText = "Latest Card Played: "

    var latestCardSpan = document.createElement('span')
    latestCardSpan.classList.add(`latest-card`);

    latestCardSpan.innerHTML = `${cardColor} ${cardValue}`
    statusDisplay.appendChild(latestCardSpan)
    cardsInPlayDiv.appendChild(statusDisplay);

    if (cardType === `wild`) {
        var newCard = renderWildCard(cardValue);
    } else if (cardType === `color`) {
        var newCard = renderColorCard(cardValue, cardColor)
    }
    newCard.id = `${cardType}-${cardColor}-${cardValue}`
    cardsInPlayDiv.appendChild(newCard);
}

function renderPlayerDeck() {
    var playerDeckDisplay = document.getElementById('player-deck')
    playerDeckDisplay.innerText = "";
    var yourDeckH2 = document.createElement('h2')
    yourDeckH2.innerText = "Your Deck";
    playerDeckDisplay.appendChild(yourDeckH2);
    for (var i = 0; i < playerDeck.length; i++) {

        //Loop through the player deck and get the following values.
        var currentCard = playerDeck[i];
        var cardType = currentCard.type;
        var cardColor = currentCard.color;
        var cardValue = currentCard.value;
        var cardIndex = i;

        //If card type is wild, render wildcard accordingly.
        if (cardType === `wild`) {
            var card = renderWildCard(cardValue);
        } else if (cardType === `color`) {
            var card = renderColorCard(cardValue, cardColor)
        }
        card.id = `${cardType}-${cardColor}-${cardValue}-${cardIndex}`
        card.addEventListener(`click`, handleCardClick)
        playerDeckDisplay.appendChild(card);
    }
}

function handleCardClick() {
    var playerCardValues = this.id.split("-")
    var playerType = playerCardValues[0]
    var playerColor = playerCardValues[1]
    var playerValue = playerCardValues[2]
    var playerIndex = playerCardValues[3]

    //If player value +2 or +4 (these are considered numbers), do not parseInt. Else if it's a number, parseInt.
    if (playerValue===`+2` || playerValue===`+4`) {
      playerValue;
    } else if (!isNaN(playerValue)) {
      playerValue = parseInt(playerValue)
    }
    var playerCard = {
      type: playerType,
      color: playerColor,
      value: playerValue
    }
    var pileColor = cardInPlay.color;
    var pileType = cardInPlay.type;
    var pileValue = cardInPlay.value;

    if (playerValue===pileValue) {
      cardInPlay = playerCard;
      playerDeck.splice(playerIndex, 1)
      renderCardInPlay();
      renderPlayerDeck();
    } else if (playerColor===pileColor) {
      cardInPlay = playerCard;
      playerDeck.splice(playerIndex, 1)
      renderCardInPlay();
      renderPlayerDeck();
    } else if (playerType===`wild`) {
      renderWildColorPicker();
      playerCard.color = colorPicked();
      if (confirmWildColor) {
        cardInPlay = playerCard;
        playerDeck.splice(playerIndex, 1)
        renderCardInPlay();
        renderPlayerDeck();
      }
    } else {
      console.log(`you can't play that cardPile.`)
    }


}

function renderComputerDeck() {
    for (var i = 0; i < computerDeck.length; i++) {
        var cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        var backCard = document.createElement('div');
        backCard.classList.add('card');
        backCard.classList.add('back-card');
        var backCardRing = document.createElement('div');
        backCardRing.classList.add('back-ring');
        backCardRing.classList.add('card-ring');
        var unoText = document.createElement('div');
        unoText.classList.add('back-middle')
        unoText.classList.add('middle')
        unoText.innerText = "UNO";
        cardContainer.appendChild(backCard);
        backCard.appendChild(backCardRing);
        backCard.appendChild(unoText);
        document.getElementById('computer-deck').appendChild(cardContainer);
    }
}

function renderColorCard(value, color) {
    var card = createDiv(`card-container`);
    var cardInner = createDiv(`card`);
    var cardRing = createDiv(`card-ring`)
    var topLeft = createDiv(`top-left`)
    var middle = createDiv(`middle`)
    var bottomRight = createDiv(`bottom-right`)

    card.appendChild(cardInner)
    cardInner.appendChild(topLeft)
    cardInner.appendChild(cardRing)
    cardInner.appendChild(middle)
    cardInner.appendChild(bottomRight)
    card.style.backgroundColor = color;

    //If value is a string, render an action OR draw2 card.
    if (value === '+2') {
        topLeft.classList.add('draw');
        middle.classList.add(`draw-middle`);
        bottomRight.classList.add(`draw`)
        topLeft.innerText = value
        middle.innerText = value
        bottomRight.innerText = value
    } else if (value === 'skip' || value === 'reverse') {
        topLeft.classList.add('action');
        middle.classList.add(`action-middle`);
        bottomRight.classList.add(`action`)
        var icon1 = document.createElement(`i`)
        var icon2 = document.createElement(`i`)
        var icon3 = document.createElement(`i`)

        icon1.classList.add(`fas`)
        icon2.classList.add(`fas`)
        icon3.classList.add(`fas`)
        if (value === `skip`) {
            icon1.classList.add(`fa-ban`)
            icon2.classList.add(`fa-ban`)
            icon3.classList.add(`fa-ban`)
        } else if (value === `reverse`) {
            icon1.classList.add(`fa-random`)
            icon2.classList.add(`fa-random`)
            icon3.classList.add(`fa-random`)
        }
        topLeft.appendChild(icon1);
        middle.appendChild(icon2);
        bottomRight.appendChild(icon3);
    } else {
        topLeft.classList.add('number')
        middle.classList.add('number-middle')
        bottomRight.classList.add('number')
        topLeft.innerText = value
        middle.innerText = value
        bottomRight.innerText = value
    }

    return card;
}


function renderWildCard(value) {
    var container = createDiv(`card-container`);
    var innerCard = createDiv(`card wild`);
    var wildRing = createDiv(`card-ring wild-ring`);
    var wildIcon = renderWildCardIcon();
    container.appendChild(innerCard)
    innerCard.appendChild(wildRing)
    innerCard.appendChild(wildIcon);
    if (value === '+4') {
        var topLeft = createDiv(`wild top-left`)
        var bottomRight = createDiv(`wild bottom-right`)
        topLeft.innerText = value
        bottomRight.innerText = value
        innerCard.appendChild(topLeft);
        innerCard.appendChild(bottomRight);
        return container;
    } else if (value === 'wildColor') {
        return container;
    }
}


function renderWildCardIcon() {
    var icon = createDiv(`wild-middle middle`)
    var bottomCard = createDiv(`wild-icon wild-bottom`)
    bottomCard.appendChild(createDiv('wild-icon-inner'))
    var rightCard = createDiv(`wild-right wild-icon`)
    rightCard.appendChild(createDiv('wild-icon-inner'))
    var topCard = createDiv(`wild-icon wild-top`);
    topCard.appendChild(createDiv('wild-icon-inner'))
    var leftCard = createDiv(`wild-icon wild-left`);
    leftCard.appendChild(createDiv('wild-icon-inner'))
    icon.appendChild(bottomCard)
    icon.appendChild(rightCard)
    icon.appendChild(topCard)
    icon.appendChild(leftCard)
    return icon;
}


function createDiv(classes) {
    var newDiv = document.createElement('div')
    newDiv.classList.value = classes
    return newDiv
}


function renderWildColorPicker() {
  var colorRow = createDiv(`color-row`)
  for (var iconNo=0; iconNo < defaultColors.length; iconNo++){
    var colorIcon = document.createElement('button');
    colorIcon.classList.add('color-icon');
    colorIcon.style.backgroundColor = defaultColors[iconNo];
    colorIcon.id = defaultColors[iconNo];
    colorIcon.addEventListener('click', colorPicked)
    colorRow.appendChild(colorIcon);
  }

  var confirmBtn = document.getElementById('confirm')
  confirmBtn.addEventListener('click', confirmWildColor);

  var container = document.querySelector('.color-picker');

  container.insertBefore(colorRow, container.lastElementChild);
  toggleDisplay(container);
}


function toggleDisplay(element) {
  if (element.classList.value.includes('hide')) {
    element.classList.remove('hide');
  } else {
    element.classList.add('hide')
  }
}

var colorPicked = function(){
  return this.id
}

var confirmWildColor = function(){
  return true;
}

generateDeck(defaultColors);
givePlayersDeck(7);
renderComputerDeck();
renderPlayerDeck();
