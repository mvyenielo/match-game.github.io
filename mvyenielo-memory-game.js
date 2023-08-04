"use strict";
document.addEventListener("DOMContentLoaded", function() {
  const gameBoard = document.querySelector('#game');
  const playButton = document.querySelector('#playButton');
  const FOUND_MATCH_WAIT_MSECS = 1000;
  const CARDNAMES = [
    "alien", "mrX", "introFace", "introParanormal", "loneGunmen",
    "mulder", "queequeg", "scully", "skinner", "smokingMan",
    "alien", "mrX", "introFace", "introParanormal", "loneGunmen",
    "mulder", "queequeg", "scully", "skinner", "smokingMan",
  ];
  let clickCount = 0;
  let playedCards = {};

  // Start/reset game by pressing "NEW GAME" button
  playButton.addEventListener("click", function (event) {

    event.preventDefault();

    const gameSection = document.getElementById('game');
    gameSection.scrollIntoView({ behavior: 'smooth' });

    const cardNames = shuffle(CARDNAMES);
    createCards(cardNames);

    // Create card for each picture (each will appear twice)
    function createCards(cardNames) {

      resetBoard(gameBoard);

      for (let name of cardNames) {
        const card = document.createElement('div');
        card.classList.add('card', name,'cardBack');
        card.addEventListener("click", handleCardClick);
        addCards(card);
      }
    }
    const oldGameCards = document.querySelector('.card');
    resetBoard(oldGameCards);
  });

  // Adds each card to the board after creating them
  function addCards(card) {
    gameBoard.appendChild(card);
  }

  // Removes all current cards ("children") from the board so that we aren't
  // adding more cards every time we restart the game
  function resetBoard(board) {
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
  }

  // Shuffle function provided
  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      // generate a random index between 0 and i
      let j = Math.floor(Math.random() * i);
      // swap item at i <-> item at j
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }


  /** Flip a card face-up. */
  // Remove the "cardBack" class so that the assigned picture class for that card is
  // visible, as well as remove ability to click on the card by removing event listener
  function flipCard(card) {
    card.classList.remove("cardBack");
    card.removeEventListener("click", handleCardClick);
  }

  /** Flip a card face-down. */
  // Add the cardBack class back so that the color of the card is no longer
  // visible, and click event listener again
  function unFlipCard(card) {
    card.classList.add("cardBack");
    card.addEventListener("click", handleCardClick);
  }

  /** Handle clicking on a card: this could be first-card or second-card. */
  function handleCardClick(evt) {
    // keep track of how many cards have been clicked (1 or 2)
    clickCount++;
    let currentCard = evt.target;
    flipCard(currentCard);

    // add current card to an object to keep track of whether it's the first or
    // second card flipped
    playedCards[clickCount] = currentCard;

    // if two cards have been turned, remove the ability to click on other cards
    // while we determine if the two cards are a match.
    if (clickCount === 2) {
      let cards = document.getElementsByClassName("card");
      for (let eachCard of cards) {
        eachCard.removeEventListener("click", handleCardClick);
      }
      // If the two cards are not a match, turn them back over
      if (playedCards[1].getAttribute("class") !== playedCards[2].getAttribute("class")) {
        setTimeout(function() {
          unFlipCard(playedCards[1]);
          unFlipCard(playedCards[2]);
        }, FOUND_MATCH_WAIT_MSECS);
      }

      // Whether the two cards are a match or not, add back the ability to click
      // on all cards that have yet to find a match
      setTimeout(function() {
          let unturnedCards = document.getElementsByClassName("cardBack");
          for (let eachCard of unturnedCards) {
            eachCard.addEventListener("click", handleCardClick);
          }
        }, FOUND_MATCH_WAIT_MSECS);

        // return the click count to 0 so we can click on two new cards
        clickCount = 0;
    }
  }
});
