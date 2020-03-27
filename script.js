var defaultColors = [`red`, `blue`, `yellow`, `green`];
const colorCardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, `skip`, `reverse`, `draw2`]

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
            value: `draw4`
        }
        var wildColor = {
            type: `wild`,
            color: "",
            value: `draw4`
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

  var startingCardsLength = num;

    for (var i= 0; i < startingCardsLength; i++) {
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
