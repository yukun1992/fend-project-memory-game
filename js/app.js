/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let cards = ["fa fa-diamond", "fa fa-diamond",
    "fa fa-paper-plane-o", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-anchor",
    "fa fa-bolt", "fa fa-bolt",
    "fa fa-cube", "fa fa-cube",
    "fa fa-leaf", "fa fa-leaf",
    "fa fa-bicycle", "fa fa-bicycle",
    "fa fa-bomb", "fa fa-bomb"];

let cardsHtml = document.querySelectorAll('ul.deck > li');
let openCards = [];
let numberOfFailedMoves = 0;
let numberOfMoves = 0;

let movesElement = document.getElementsByClassName("moves")[0];

let starsElements = document.querySelectorAll(".stars > li > i");

document.getElementsByClassName("restart")[0].addEventListener('click', resetGame);

const timeToShowCardInMs = 200;

let timer = null;
let startTime = new Date().getTime();
let currentTime;

function resetGame() {
    cards = shuffle(cards);
    addCardsInHtml(cards, cardsHtml);
    turnCardsFaceDown();
    resetVariables();
    resetTimer();
    startTimer();
}

function addCardsInHtml(cards, cardsHtml) {
    for(i = 0; i < cards.length; i++) {
        cardsHtml[i].firstElementChild.className = cards[i];
    }
}

function turnCardsFaceDown() {
    cardsHtml.forEach(function(e) {
        e.className = "card";
    });
}

function resetVariables() {
    openCards = [];
    numberOfFailedMoves = 0;
    numberOfMoves = 0;
    starsElements.forEach(function(e) {
        e.className = "fa fa-star";
    });
    updateMovesElement();
}

function updateMovesElement() {
    movesElement.innerHTML = numberOfMoves + " Steps";
}

function resetTimer() {
    startTime = new Date().getTime();
}

// convert unix time to real time
function startTimer() {
    timer = setInterval(function() {
        let now = new Date().getTime();
        let elapsed = now - startTime;
        let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        currentTime = minutes + ':' + seconds;
        let clock = document.getElementsByClassName("clock")[0];
        clock.innerHTML = "Time: " + currentTime;
    }, 1000);
}

function addEventListenerToCards() {
    cardsHtml.forEach(function(e) {
        e.addEventListener('click', function() {
            if (this.className === "card") {
                displayCard(this);
                addCardOpenCards(this);
                checkWinConditionAndAct();
            }
        });
    });
}

function displayCard(card) {
    card.className = "card open show";
}

function addCardOpenCards(card) {
    openCards.push(card);
}

function checkWinConditionAndAct() {
    if (openCards.length == 2) {
        if (checkCardsEqual()) {
            changeOpenCardsClassWhenMatch();
        } else {
            changeOpenCardsClassWhenNotMatch();
            numberOfFailedMoves++;
            updateStarts();
        }
        openCards = [];
        numberOfMoves++;
        updateMovesElement();
        isGameOver();
    }
}

function checkCardsEqual() {
    return openCards[0].firstElementChild.className === openCards[1].firstElementChild.className;
}

function changeOpenCardsClassWhenMatch() {
    var lastOpenCards = openCards;
    setTimeout(function() {
        lastOpenCards[0].className = "card match";
        lastOpenCards[1].className = "card match";
    }, timeToShowCardInMs);
}

function changeOpenCardsClassWhenNotMatch() {
    var lastOpenCards = openCards;
    setTimeout(function() {
        lastOpenCards[0].className = "card notMatch";
        lastOpenCards[1].className = "card notMatch";
        setTimeout(function() {
            lastOpenCards[0].className = "card";
            lastOpenCards[1].className = "card";
        }, timeToShowCardInMs);
    }, timeToShowCardInMs);
}

function updateStarts() {
    if (numberOfFailedMoves == 3) {
        starsElements[2].className = "fa fa-star disabled";
    }
    else if (numberOfFailedMoves == 6) {
        starsElements[1].className = "fa fa-star disabled";
    }
    else if (numberOfFailedMoves == 9) {
        starsElements[0].className = "fa fa-star disabled";
    }
}

function isGameOver() {
    setTimeout(function() {
        cardElements = document.querySelectorAll('.card:not(.match)');
        if (cardElements.length === 0) {
            alert("You win!!! Total steps: " + numberOfMoves);
            resetGame();
        }
    }, timeToShowCardInMs * 2);
}

resetGame();
addEventListenerToCards();