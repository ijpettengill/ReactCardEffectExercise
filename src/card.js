import React from "react";

const Card = (card) => {
  const code = card.card.code;
  const image = card.card.image;
  return (
    <div>
      <img key={code} src={image} alt={code} />
    </div>
  );
};

export default Card;