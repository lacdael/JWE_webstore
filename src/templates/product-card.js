import React from "react";
import "./product-card.css";

export default function ProductCard({
  title,
  price,
  currency,
  originalPrice,
  image,
  merchant,
  url,
  badge,
  description
}) {
  return (
    <a href={url} className="product-card" target="_blank" rel="noopener noreferrer">
      {badge && <div className="product-badge">{badge}</div>}

      <div className="product-image-wrap">
        <img src={image} alt={title} className="product-image" />
      </div>

      <div className="product-info">
        <div className="product-title">{title}</div>
  {description && (
          <p className="product-description">
            {description}
          </p>
        )}

        <div className="product-pricing">
          <span className="product-price">{currency} {price}</span>
        </div>
      </div>
    </a>
  );
}

