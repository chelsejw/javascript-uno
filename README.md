# JavaScript Uno

## Intro
This game was written JavaScript, CSS & HTML for SEI-22 Project 1.
UNO cards are made with CSS!

Rules here:
https://www.unorules.com/

Exceptions in my version:
* Starter card being an action card has no effect on the first player
* If starter card is a wildcard, a color is randomly chosen.
* There is also no need to say Uno. Haha.

## Occasional Bugs
* There are some errors that occur, specifically "...cannot read length property of undefined at line 471" within the console. Haven't figured out why or which conditions cause it to occur yet.
* Winner display might show player as "null" instead of the winner.
* Card doesn't get played when last card from user is a wildcard.
