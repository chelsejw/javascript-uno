function renderComputerDeck(comNo) {
    var computerDeck;
    var computerDeckDiv
    if (comNo === 1) {
        computerDeck = computer1Deck;
        computerDeckDiv = document.getElementById(`computer1-deck`);
    } else if (comNo === 2) {
        computerDeck = computer2Deck;
        computerDeckDiv = document.getElementById(`computer2-deck`);
    }

    computerDeckDiv.innerText = "";

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
        computerDeckDiv.appendChild(cardContainer);
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
    } else if (value === 'wild') {
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
    for (var iconNo = 0; iconNo < usersColors.length; iconNo++) {
        var colorIcon = document.createElement('button');
        colorIcon.classList.add('color-icon');
        colorIcon.style.backgroundColor = usersColors[iconNo];
        colorIcon.id = usersColors[iconNo];
        colorIcon.addEventListener('click', colorPicked)
        colorRow.appendChild(colorIcon);
    }
    var container = document.getElementById('generated-colorpicker');
    container.innerText = "";
    container.appendChild(colorRow);
}


function toggleDisplay(element) {
    if (element.classList.value.includes('hide')) {
        element.classList.remove('hide');
    } else {
        element.classList.add('hide')
    }
}


function renderCardInPlay() {

    var cardsInPlayDiv = document.getElementById('cards-in-play')
    cardsInPlayDiv.innerText = "";

    var latestCard = getLatestCard()
    var cardType = latestCard.type;
    var cardColor = latestCard.color;
    var cardValue = latestCard.value;

    if (cardType === `wild`) {
        var newCard = renderWildCard(cardValue);
        newCard.classList.add('latest-card-image')
    } else if (cardType === `color`) {
        var newCard = renderColorCard(cardValue, cardColor)
        newCard.classList.add('latest-card-image')
    }
    newCard.id = `${cardType}-${cardColor}-${cardValue}`
    cardsInPlayDiv.appendChild(newCard);
}

function getLatestCard() {
    return cardInPlay[cardInPlay.length - 1];
}

function renderPlayerDeck() {

    //DOM
    var playerDeckDisplay = document.getElementById('player-deck')
    playerDeckDisplay.innerText = "";
    for (var i = 0; i < playerDeck.length; i++) {

        //Loop through the player deck and get the following values.
        var cardType = playerDeck[i].type;
        var cardColor = playerDeck[i].color;
        var cardValue = playerDeck[i].value;
        playerDeck[i].indexInDeck = i; //Assign an updated index value to card

        //If card type is wild, render wildcard accordingly.
        if (cardType === `wild`) {
            var card = renderWildCard(cardValue);
        } else if (cardType === `color`) {
            var card = renderColorCard(cardValue, cardColor)
        }

        card.id = `${cardType}-${cardColor}-${cardValue}-${playerDeck[i].indexInDeck}`
        card.addEventListener(`click`, handleCardClick)
        playerDeckDisplay.appendChild(card);
    }
}



///START GAME FUNCTIONS

var nameInput = document.getElementById('name-input');
var defaultColorBtn = document.getElementById('default-btn')
var customColorBtn = document.getElementById('custom-btn')
var errorContainer = document.getElementById('error-container')
var errorMsg = document.getElementById('error-message')
var startBtn = document.getElementById('start-btn')
var customColContainer = document.getElementById('custom-col-container')

startBtn.addEventListener('click', startButton)
defaultColorBtn.addEventListener('click', defaultOrCustom)
customColorBtn.addEventListener('click', defaultOrCustom)

var customColInputs = document.querySelectorAll('.custom-input');

for (var i = 0; i < customColInputs.length; i++) {
    customColInputs[i].addEventListener('change', showCustomCol);
}

var chosenOption = null;


function showCustomCol() {
    var input = this.value;
    this.style.backgroundColor = input
}

function getCustomCols() {
    var newArr = []
    for (var i = 0; i < customColInputs.length; i++) {
        if (customColInputs[i].value === "") {
            return false
        }
        newArr.push(customColInputs[i].value);
    }

    if (newArr.length === 4) {
        return newArr;
    }
}

function startButton() {

    if (chosenOption && nameInput.value !== "") {
        playerName = nameInput.value
        if (chosenOption === "customColors") {
            var valid = getCustomCols();
            if (valid) {
                usersColors = getCustomCols();
                startGame();
            } else {
                if (errorContainer.classList.value.includes('hide')) {
                    errorContainer.classList.remove('hide');
                }
                errorMsg.innerText = "Please give a value for all four colours."
            }
        } else if (chosenOption==="defaultColors") {
          usersColors = defaultColors;
          startGame();
        }
    } else {
        //If both inputs are not complete: show the error div if it's hidden.
        if (errorContainer.classList.value.includes('hide')) {
            errorContainer.classList.remove('hide');
        }
        if (!chosenOption) {
            errorMsg.innerText = "Sorry, please choose an option for your colors."
        } else if (nameInput.value === "") {
            errorMsg.innerText = "Please enter a name."
        } else if (!chosenOption && nameInput.value === "") {
            errorMsg.innerText = 'Sorry, please ensure you have chosen a color option & entered your name.'
        }
    }
}

function defaultOrCustom() {
    chosenOption = this.value
    console.log(chosenOption)
    if (chosenOption === 'customColors') {
        if (customColContainer.classList.value.includes('hide')) {
            customColContainer.classList.remove('hide')
        }
    } else if (chosenOption === 'defaultColors')
        if (!customColContainer.classList.value.includes('hide')) {
            customColContainer.classList.add('hide')
        }
}
