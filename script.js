var defaultColors = [`red`, `blue`, `yellow`, `green`];
const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `+2`]

var object = {
    type: `color/wild`,
    color: ``,
}


//The card pile that players can get cards from.
var cardPile = [];

var playerDeck = [];
var computerDeck = [];

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
        var randomIndex2 = getRandomInt(cardPile.length)
        var randomCard2 = cardPile[randomIndex2];
        computerDeck.push(randomCard2)
    }

    console.log(playerDeck);
    console.log(computerDeck);
}

function renderPlayerDeck() {
    var playerDeckDisplay = document.getElementById('player-deck')
    for (var i = 0; i < playerDeck.length; i++) {

        //Loop through the player deck and get the following values.
        var currentCard = playerDeck[i];
        var cardType = currentCard.type;
        var cardColor = currentCard.color;
        var cardValue = currentCard.value;

        //If card type is wild, render wildcard accordingly.
        if (cardType === `wild`) {
            var card = renderWildCard(cardValue);
        } else if (cardType === `color`) {
            var card = renderColorCard(cardValue, cardColor)
        }
        card.id = `${cardColor}-${cardValue}-${cardType}`
        card.addEventListener(`click`, handleCardClick)
        playerDeckDisplay.appendChild(card);
    }
}

function handleCardClick() {
    return console.log(`i got clicked`);
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

generateDeck(defaultColors);
givePlayersDeck(7);
renderComputerDeck();
renderPlayerDeck();
