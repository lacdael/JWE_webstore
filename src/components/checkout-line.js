import React from "react";
import "./checkout-line.css";

export default function CheckoutLine({
  image,
  title,
  description,
  quantity,
  price,
  currency,
  shipping,
  total,
}) {
  return (
    <div className="checkout-line">
      <div className="line-image">
        <img src={image} alt={title} />
      </div>

      <div className="line-content">
        <div className="line-title">{title}</div>
        <div className="line-description">{description}</div>

        <div className="line-row">
          <span></span>
          <span>{price}</span>
        </div>

        <div className="line-row">
          <span>Shipping</span>
          <span>{shipping}</span>
        </div>

        <div className="line-row total">
          <span>Total</span>
          <span>{total} {currency}</span>
        </div>
      </div>
    </div>
  );
}

