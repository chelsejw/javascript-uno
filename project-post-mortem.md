# Approach and Process

### What in my process and approach to this project would I do differently next time?

Really plan out how I want my UI to look like first, and stick with it, as I had to rework it a few times.

Try to avoid having so many global variables.

Didn't really map out what should happen whenever a player draws a card/ computer makes a move / etc.. so at some point my code had a lot of repeated & scattered renderPlayerCard(), renderComputerDeck(), nextPlayer(). Ended up chunking everything into a refreshDisplays() function.

### What in my process and approach to this project went well that I would repeat next time?

I think I planned my main data structures (e.g. card objects) well such that most of it can be used simply across many functions.


### Code and Code Design
What in my code and program design in the project would I do differently next time?

The way I wrote/render my HTML card elements. There are multiple div layers for one card, and I didn't know how to save the whole chunk as a variable (like components in React), I ended up writing a ton of doc.createElements.


```
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

```

The above code was to render some elements of my action cards, using FontAwesome classes. I was weirdly adamant about using pure css/html, and could have saved some time if I just used pngs for my skip/reverse icons.

As for program design, my CSS was quite haphazardly planned as I was focused on creating the Uno cards, but didn't think much about how the app would look as a whole. So my cards ended up being too big, and my user can't see the whole game even at full viewport height, they have to scroll down to look at their own/opponents' cards.

Because the positioning of several small elements within the cards are dependent on the parent's width/height, it's not an easy task to adjust the cards' sizing. I would definitely aim to make my CSS cards dynamic. Probably gotta read about CSS calculations.

### What in my code and program design in the project went well? Is there anything I would do the same next time?

I think my simplest approach method, though it might be inefficient, at least makes my code readable. I also try to name my variables & functions harmoniously.

```
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

```

## WDI Unit 1 Post Mortem
### What habits did I use during this unit that helped me?
* Coding with beats that I like keeps me awake and in the zone.
* Use code snippets to try out new functions/methods
* Visualise what I want to achieve if I can't figure it with code
* Was really keen on helping people debug, and I think that allowed me to learn different methods/logic

### What habits did I have during this unit that I can improve on?

* Remembered the wrong due date, spent my weekend playing Animal Crossing....
* Worked really hard for the first two assignments, then got burnt out.
* If something looks too daunting I just didn't try.
* I really just use loops for sooo many things.


### How is the overall level of the course during this unit? (instruction, course materials, etc.)

* Not sure if it's the remote format, but the lessons are not super engaging.
* Gitbook has typos/bugs sometimes.
* I really like seeing the live debug sessions though.
