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

    //If value of the card is a string, render an action OR draw2 card.
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


function toggleHide(element) {
    if (element.classList.value.includes('hide')) {
        element.classList.remove('hide');
    } else {
        element.classList.add('hide')
    }
}

function renderCardInPlay() {
    var cardsInPlayDiv = document.getElementById('cards-in-play')
    cardsInPlayDiv.innerText = "";
    var latestCard = cardInPlay[cardInPlay.length-1]
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


function renderPlayerDeck() {
    var playerDeckDisplay = document.getElementById('player-deck')
    playerDeckDisplay.innerText = "";
    for (var i = 0; i < playerDeck.length; i++) {
        //Loop through the player deck and get the following values.
        var cardType = playerDeck[i].type;
        var cardColor = playerDeck[i].color;
        var cardValue = playerDeck[i].value;
        playerDeck[i].indexInDeck = i; //Assign an updated indexInDeck value to card

        //Render the card according to its type.
        if (cardType === `wild`) {
            var card = renderWildCard(cardValue);
        } else if (cardType === `color`) {
            var card = renderColorCard(cardValue, cardColor)
        }

        //Give the card an ID so that we can get its values from handleCardClick functions.
        card.id = `${cardType}-${cardColor}-${cardValue}-${playerDeck[i].indexInDeck}`
        card.addEventListener(`click`, handleCardClick)

        //Add the new card element to the display.
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
var chosenOption = null;

//Add click listeners to the buttons.
startBtn.addEventListener('click', startButton)
defaultColorBtn.addEventListener('click', chooseDeckType)
customColorBtn.addEventListener('click', chooseDeckType)

//Add change event listeners to the custom color inputs.
var customColInputs = document.querySelectorAll('.custom-input');
for (var i = 0; i < customColInputs.length; i++) {
    customColInputs[i].addEventListener('change', showCustomCol);
}

//Color inputs should change its background color according to the input.
function showCustomCol() {
    var input = this.value;
    this.style.backgroundColor = input
}

//Gets the four custom color inputs. Returns false if any of the inputs are not valid, if not, returns an array of the selected colors.
function getCustomCols() {
    var newArr = []
    for (var i = 0; i < customColInputs.length; i++) {
        var inputValue = customColInputs[i].value.toLowerCase();
        //if input is not a valid CSS color, is empty, or is white, then return false
        if (!isColor(inputValue) || inputValue === "" || inputValue === "white" || inputValue === "#ffffff") {
            return false
        }
        newArr.push(customColInputs[i].value);
    }
    return newArr;
}

// Triggered when user clicks the start button.
function startButton() {

  //If there is a chosen option & name input is not empty,
    if (chosenOption && nameInput.value !== "") {

      //Assign player name the nameInput
        playerName = nameInput.value

        //If the user chose custom colors, and they had valid inputs, assign the colors to the usersColors & start the game
        if (chosenOption === "customColors") {
            var valid = getCustomCols();
            if (valid) {
                usersColors = getCustomCols();
                startGame();

            //If the custom color inputs were not valid, show error message.
            } else {
              //If error div is hidden, show it.
                if (errorContainer.classList.value.includes('hide')) {
                    errorContainer.classList.remove('hide');
                }
                errorMsg.innerText = "Please give a valid color for all four inputs."
            }
        //If user chose default colors, assign default colors to the usersColors and start game.
        } else if (chosenOption === "defaultColors") {
            usersColors = defaultColors;
            startGame();
        }
    } else {
        //If both inputs are not complete...
        //Show the error div if it's hidden.
        if (errorContainer.classList.value.includes('hide')) {
            errorContainer.classList.remove('hide');
        }
        //Error message if no deck color option was chosen.
        if (!chosenOption) {
            errorMsg.innerText = "Sorry, please choose an option for your colors."
        //Error message if name input is empty.
        } else if (nameInput.value === "") {
            errorMsg.innerText = "Please enter a name."
        //Error message if both name input is empty & no deck color option was chosen.
        } else if (!chosenOption && nameInput.value === "") {
            errorMsg.innerText = 'Sorry, please ensure you have chosen a color option & entered your name.'
        }
    }
}

//Triggered whenever a deckColor option is clicked (default or custom)
function chooseDeckType() {
  //Remove active button class according to what was the previous selected button.
    if (chosenOption === 'customColors' && this.value === "defaultColors") {
        document.getElementById('custom-btn').classList.remove('active-btn')
    } else if (chosenOption === 'defaultColors' && this.value === 'customColors') {
        document.getElementById('default-btn').classList.remove('active-btn')
    }
    //Assign the value of the button to chosenOption.
    chosenOption = this.value
    //Make this the active button.
    this.classList.add('active-btn')
    //If the user selects customColors, show custom color inputs if they are hidden.
    if (chosenOption === 'customColors') {
        if (customColContainer.classList.value.includes('hide')) {
            customColContainer.classList.remove('hide')
        }
    //If the user selects defaultColors, hide custom color inputs if they are showing up.
    } else if (chosenOption === 'defaultColors')
        if (!customColContainer.classList.value.includes('hide')) {
            customColContainer.classList.add('hide')
        }
}
