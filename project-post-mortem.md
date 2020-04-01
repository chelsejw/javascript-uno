Approach and Process
#What in my process and approach to this project would I do differently next time?

 Really plan out how I want my UI to look like first, and stick with it, as I had to rework it at some point.

 Try to avoid having so many global variables.

#What in my process and approach to this project went well that I would repeat next time?

I think I planned my main data structures (e.g. card objects) well such that most of it can be used simply across many functions.


#Code and Code Design
What in my code and program design in the project would I do differently next time?

The way I wrote/render my HTML card elements. Cause there are a lot of div layers for one card, and I didn't know how to kinda save the structure as a variable (like components in React), I ended up writing a ton of doc.createElements.


``
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
``


What in my code and program design in the project went well? Is there anything I would do the same next time?

For each, please include code examples.

Code snippet up to 20 lines.
Code design documents or architecture drawings / diagrams.
WDI Unit 1 Post Mortem
What habits did I use during this unit that helped me?
What habits did I have during this unit that I can improve on?
How is the overall level of the course during this unit? (instruction, course materials, etc.)
