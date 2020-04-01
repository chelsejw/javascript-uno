//Deck color arrays (length should always be 4)
var defaultColors = [`red`, `blue`, `gold`, `green`];
var usersColors = [];

//Arrays which would have card object items in them.
var cardPile = [];
var playerDeck = [];
var computer1Deck = [];
var computer2Deck = [];
var cardInPlay = [];

//Game status trackers.
var playerName = null;
var latestMove = null;
var selectedColor = null; //Shouldn't be global but had no choice

//User scores.
var userScore = 0;
var com1Score = 0;
var com2Score = 0;

//For the player turn order, game always starts with the user.
var orderOfPlayers = [playerName, `Computer 1`, `Computer 2`]
var indexOfLastPlayer = orderOfPlayers.length - 1
var nextPlayer = null;

//Draw Button
var drawBtn = document.getElementById('drawcard-btn')
drawBtn.addEventListener('click', drawOne)

// =============GENERAL FUNCTIONS=============
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//If strColor is a valid CSS colors style, return true.
function isColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}

//Creates a div with multiple classes (given as one string)
function createDiv(classes) {
    var newDiv = document.createElement('div')
    newDiv.classList.value = classes
    return newDiv
}

function getLatestCard() {
    return cardInPlay[cardInPlay.length - 1];
}

function toggleHide(element) {
    if (element.classList.value.includes('hide')) {
        element.classList.remove('hide');
    } else {
        element.classList.add('hide')
    }
}

// =============GAME SPECIFIC FUNCTIONS=============

//Triggered once all user inputs at the start are valid.
function startGame() {
    document.querySelector(`.starter`).classList.add('hide');
    document.querySelector(`.deck-body`).classList.add('flex')
    document.querySelector(`.display`).classList.remove('hide');

    //All elements with class "user-name" displays the player's name.
    var userNameElements = document.querySelectorAll('.user-name')
    for (var i = 0; i < userNameElements.length; i++) {
        userNameElements[i].innerText = playerName;
    }
    newGame();
}

function refreshDisplays() {
    //Middle Display: latest card image, latest card info & game status.
    renderCardInPlay();
    gameStatusDisplay();
    showLatestCard();

    //Left Display: Current player, next player, and latest action.
    displayLatestMove();
    showCurrentPlayer();
    showNextPlayer();

    //Bottom display: Render all players' decks.
    renderPlayerDeck();
    renderComputerDeck(1);
    renderComputerDeck(2);
}

//Depending on the current player, let player know what's happening in the game.
function gameStatusDisplay() {
    var gameStatus = document.getElementById('current-status')
    if (currentPlayer === playerName) {
        gameStatus.innerText = `It's your turn!`
        gameStatus.style.animation = "slideInUp 0.5s, bounce-4 1s infinite 0.5s"
    } else{
        gameStatus.innerText = `${currentPlayer} is making a move...`

        //Animate them in differently according to player.
        if (currentPlayer==="Computer 1") {
          gameStatus.style.animation = "zoomIn 0.5s, pulse 1s infinite 0.5s";
        } else if (currentPlayer==="Computer 2") {
          gameStatus.style.animation = "lightSpeedIn 0.5s, pulse 1s infinite 0.5s";
        }
    }
}

//Function that targets latest-card div (under the game status div and shows the last card in the cardInPlay array.)
function showLatestCard() {
    var card = cardInPlay[cardInPlay.length - 1];
    var latestCardDiv = document.getElementById('latest-card')
    latestCardDiv.style.backgroundColor = card.color;
    latestCardDiv.innerText = `${card.color} ${card.value}`
}

//Display latest move (DOM)
function displayLatestMove() {
    var latestMoveSpan = document.getElementById('latest-move');
    latestMoveSpan.innerText = latestMove;
}

//Display current player (DOM)
function showCurrentPlayer() {
    var currentPlayerDisplay = document.getElementById('current-player');
    currentPlayerDisplay.innerText = currentPlayer;
}

//Get the value of the next player then display it, returns string name of the nextPlayer. (Without changing value of current player)
function showNextPlayer() {
    if (playerIndex === indexOfLastPlayer) {
        nextPlayer = orderOfPlayers[0];
    } else {
        nextPlayer = orderOfPlayers[playerIndex + 1]
    }

    var nextPlayerDiv = document.getElementById('next-player')
    nextPlayerDiv.innerText = nextPlayer;

    return nextPlayer;
}

function newGame() {
    //Remove cards from all the players & card pile.
    cardPile = []
    playerDeck = [];
    computer1Deck = [];
    computer2Deck = [];
    //Reset the order of players.
    orderOfPlayers = [playerName, `Computer 1`, `Computer 2`];
    playerIndex = 0;
    currentPlayer = orderOfPlayers[playerIndex];
    //Regenerate the deck, hand out 7 cards each, then refresh the display.
    generateDeck();
    givePlayersDeck(7);
    refreshDisplays();
}

//Draw one card from the pile, is only called when user clicks on DRAW button.
function drawOne() {
    drawCards(1, playerDeck);
    changePlayer();
    refreshDisplays();
}

function generateDeck() {
    var colorChoices = usersColors; //Gets the usersColors given from start game inputs.
    const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `+2`]

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

function givePlayersDeck(num) {
    drawCards(7, playerDeck);
    drawCards(7, computer1Deck);
    drawCards(7, computer2Deck);
    var starterCard = cardPile.splice(getRandomInt(cardPile.length), 1);

    //Splicing this way returns an array of only 1 item, so reassign value to the first object in that array.
    starterCard = starterCard[0];

    //If the starter card is wild, assign a random color from the usersColors
    if (starterCard.type === 'wild') {
        var randomColorIndex = getRandomInt(3);
        var randomColor = usersColors[randomColorIndex];
        starterCard.color = randomColor
    }

    //Then play the card & render it.
    cardInPlay.push(starterCard);
    renderCardInPlay();

    //Latest move = starter card is <cardcolor cardvalue>
    latestMove = `Starter Card is ${starterCard.color} ${starterCard.value}`;

}


function handleCardClick() {

    var colorPicker = document.querySelector('.color-picker')

    //If colorPicker div is not hidden, hide it.
    if (!colorPicker.classList.value.includes('hide')) {
        toggleHide(colorPicker);
    }

    //Rebuild the playerCard object according to values from the selected card element's ID.
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
        //If player card is wild, it will always be playable, so no need to check.
        if (playerType === `wild`) {
            //Unhide color picker div and render color buttons.
            renderWildColorPicker();
            toggleHide(colorPicker);
            //Add event listener to the confirm button.
            var confirmBtn = document.getElementById('confirm');
            confirmBtn.addEventListener('click', function(event) {
                //If selectedColor (global var) is not null, then assign the selectedColor to wildcard and play it, hide the colorpicker div, then remove value from selectedColor for future wildcards.
                if (selectedColor) {
                    playerCard.color = selectedColor;
                    playThisCard(playerCard, playerDeck);
                    toggleHide(colorPicker);
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
    var latestCard = cardInPlay[cardInPlay.length - 1]
    if (card.value === latestCard.value) {
        return true
    } else if (card.color === latestCard.color) {
        return true
    } else {
        return false
    }
}

//Function moves a card from someone's deck & sets it as the CardInPlay
//"card" should be a card object with an index key, and deck is player/computer deck array
function playThisCard(card, deck) {

    //Move the card from the specified deck to the cardInPlay array.
    cardInPlay.push(card);
    deck.splice(card.indexInDeck, 1)

    //Give latest move info.
    latestMove = `${card.color} ${card.value} from ${currentPlayer}`

    //The affected deck would be the next player.
    var nextPlayer = showNextPlayer();

    //From the name of the next player, get their decks.
    if (nextPlayer === playerName) {
        affectedDeck = playerDeck
    } else if (nextPlayer === "Computer 1") {
        affectedDeck = computer1Deck;
    } else if (nextPlayer === "Computer 2") {
        affectedDeck = computer2Deck
    }

    //If the cards are any of the "action" cards, call the appropriate function.
    if (card.value === '+2') {
        drawCards(2, affectedDeck);
    } else if (card.value === '+4') {
        drawCards(4, affectedDeck)
    } else if (card.value === 'skip') {
        changePlayer();
    } else if (card.value === 'reverse') {
        reversePlayerOrder();
    }

    //After the actions have been taken, check for win.
    //Checkwin returns the player's name if there is a winner, if no winner it returns false.
    var winner = checkWin();

    //If there is a winner, show it on gamestatus, refresh the scoreboard & reset game in 5 seconds.
    if (winner) {
        latestMove =`${winner} has won! Going to the next round in 5 seconds...`
        displayLatestMove();
        refreshScoreboard();
        return setTimeout(newGame, 5000)
        //If there is no winner move on to the next player & refresh displays.
    } else {
        changePlayer();
        refreshDisplays();
    }
}


function checkForComputerMove() {
    //If current player is not the user & currentPlayer is not falsey (ie when there's a winner, currentPlayer = null)
    if (currentPlayer !== playerName && currentPlayer) {
        computerPlayerIndex = 2
        setTimeout(computerMove, 4000)
    }
}

function reversePlayerOrder() {
    var reversedOrder = []
    var noOfLoops = orderOfPlayers.length
    for (var i = 0; i < noOfLoops; i++) {
        reversedOrder.push(orderOfPlayers.pop());
    }
    orderOfPlayers = reversedOrder;
    playerIndex = orderOfPlayers.findIndex(name => name === currentPlayer);
}

function changePlayer() {
    //If current player is the last, go back to the first player.
    if (playerIndex === indexOfLastPlayer) {
        playerIndex = 0;
        //Else, proceed to the next player in the order.
    } else {
        playerIndex++;
    }
    currentPlayer = orderOfPlayers[playerIndex];

    //Every turn, check if computer should make a move.
    checkForComputerMove();
}

function drawCards(numOfCards, deck) {
    //For the number of cards you want, remove a random card from the card pile & add it to the specified deck.
    for (var i = 0; i < numOfCards; i++) {
        var randomIndex = getRandomInt(cardPile.length)
        var randomCard = cardPile[randomIndex];
        deck.push(randomCard);
        cardPile.splice(randomIndex, 1);
    }
    //If the cardPile gets below five, then reshuffle the cards in play and put it back into the cardpile.
    if (cardPile.length < 5) {
        shuffleCardPile();
    }
    //Update latest move to state that the player drew a card.
    latestMove = `${currentPlayer} drew a card`
}

function shuffleCardPile() {
    //Remove the latest card from the cards in play
    var latestCard = cardInPlay.pop();
    //Get a random card from the cards left in cardInPlay, and put it back into the pile.
    var currentLength = cardInPlay.length
    for (var i = 0; i < currentLength; i++) {
        var randomIndex = getRandomInt(cardInPlay.length);
        var randomCard = cardInPlay[randomIndex];
        cardPile.push(randomCard);
        cardInPlay.splice(randomIndex, 1);
    }
    cardInPlay.push(latestCard);
}

function getRandomItem(arr) {
    var randomIndex = getRandomInt(arr.length - 1);
    var randomItem = arr[randomIndex];
    return randomItem;
}

//comDeck is the array of opponent's cards eg computerDeck
function computerMove() {
    var computerDeck;
    if (currentPlayer === "Computer 1") {
        computerDeck = computer1Deck;
    } else if (currentPlayer === "Computer 2") {
        computerDeck = computer2Deck;
    }

    //Computer has not made a move.
    var moveWasMade = false;

    //Array to track computer's deck colors in case they play a wild card.
    var deckColors = []

    //Assume there is only wild cards at first.
    var onlyWildCards = true;

    //First reassign an indexInDeck value & track the card colors for all the cards.
    for (var i = 0; i < computerDeck.length; i++) {
        var card = computerDeck[i]
        card.indexInDeck = i; //Assign index for splicing later
        //If this card that isn't a wildcard, onlyWildCards becomes false.
        if (card.type !== "wild") {
            onlyWildCards = false;
            deckColors.push(card.color) //Track only the non-wild cards in the deckColors array.
        }
    }

    //Then loop through and check for valid move.
    for (var i = 0; i < computerDeck.length; i++) {
        var card = computerDeck[i]
        var validMove = checkValidMove(card)
        if (validMove) {
            playThisCard(card, computerDeck);
            refreshDisplays();

            //Computer made a move.
            return moveWasMade = true;
        } else if (card.type === 'wild') {
            //If the deck only has wild cards, select a random color from the default colors.
            if (onlyWildCards) {
                randomColor = getRandomItem(usersColors);
                //Else if the deck has color cards as well, select a random color from the deck's colors.
            } else {
                randomColor = getRandomItem(deckColors);
            }
            //Assign the card the randomColor, then play it.
            card.color = randomColor;
            playThisCard(card, computerDeck);
            refreshDisplays();
            return moveWasMade = true;
        }
    }

    //If the computer could not make a move, computer should draw a card.
    if (!moveWasMade) {
        drawCards(1, computerDeck);
        changePlayer();
        refreshDisplays();
    }
}

//If any of the players' arrays are empty, they are a winner.
function checkWin() {
    if (computer1Deck.length === 0) {
        currentPlayer = null;
        com1Score++
        return `Computer 1`;
    } else if (computer2Deck.length === 0) {
        currentPlayer = null;
        com2Score++;
        return `Computer 2`
    } else if (playerDeck.length === 0) {
        currentPlayer = null;
        userScore++;
        return playerName
    }
}


//Updates the scoreboard DOM with current scores.
function refreshScoreboard() {
    document.getElementById('user-score').innerText = userScore
    document.getElementById('com1-score').innerText = com1Score
    document.getElementById('com2-score').innerText = com2Score
}



///======================START GAME FUNCTIONS===============================
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


//===============RENDER CARD/DECKS FUNCTIONS==============

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
        var cardContainer = createDiv('card-container')
        var backCard = createDiv('card back-card')
        var backCardRing = createDiv('back-ring card-ring')
        var unoText = createDiv('back-middle middle')
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
