import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState(null);
  const [cardCount, setCardCount] = useState(1);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerId = useRef();

  // Effect for drawing one card.
  useEffect(() => {
    if (!deck) {
      async function fetchDeck() {
        const res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
        setDeck(res.data.deck_id);
      }
      fetchDeck();
    }
  }, [deck]);

  // Effect for autoDraw
  useEffect(() => {
    // sets inteveral when autoDraw is on, but also makes sure there is only one interval 
    if (autoDraw && !timerId.current) {
      timerId.current = setInterval(() => {
        async function autoDrawCard() {
          const res = await axios.get(
            `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`
          );
          setCard(res.data.cards[0]);
          setCardCount(cardCount + 1);
        }
        autoDrawCard();
      }, 1000); 
    }
    // resets deck if deck is empty.
    if (cardCount > 52) {
      setDeck(null);
      setCardCount(1);
    }
  }, [autoDraw, deck, cardCount]);

  // Handles drawing a single card. Resets deck when deck is empty.
  const handleDrawCard = async () => {
    if (cardCount > 52) {
      setDeck(null);
      setCardCount(1);
    } else {
      const res = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`
      );
      setCard(res.data.cards[0]);
      setCardCount(cardCount + 1);
    }
  };

  // changes autoDraw to true.
  const handleAutoDraw = async () => {
    setAutoDraw(true);
  };

  // stops the interval that handles auto draw.
  const stopInterval = () => {
    clearInterval(timerId.current);
    timerId.current = null;
    setAutoDraw(false);
  }

  return (
    <div>
      <button onClick={handleDrawCard}>Draw Card</button>
      {autoDraw ? <button onClick={stopInterval}>Stop Drawing</button> : <button onClick={handleAutoDraw}>Auto Draw</button>}
      {card ? <Card card={card} /> : <p>Play Card</p>}
    </div>
  );
};

export default Deck;