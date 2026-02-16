import React, { useState } from "react";
import "./product-detail.css";
import { CheckoutModal } from "../components/checkout-form"; 

export default function ProductDetail({
  title,
  images = [],
  price,
  originalPrice,
  currency,
  description,
  specs,
  availability = "In stock",
  buyUrl,
}) {
  const [activeImage, setActiveImage] = useState(0);
  const mainImage = images[activeImage] || images[0];
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="product-detail">
      { showModal && <CheckoutModal
	      image={mainImage}
	      title={title}
	      description={description}
	      price={ price }
	      currency={ currency }
	      shipping={ 0 }
	      show={setShowModal} /> }
      {/* LEFT: image gallery */}
      <div className="product-gallery">
        <div className="product-main-image">
          <img src={mainImage} alt={title} />
        </div>

        {images.length > 1 && (
          <div className="product-thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                className={`thumbnail ${
                  i === activeImage ? "active" : ""
                }`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`${title} ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: content */}
      <div className="product-info">
        <h1 className="product-title">{title}</h1>

        <div className="product-price">
          {originalPrice && (
            <span className="product-original">
              {originalPrice} {currency}
            </span>
          )}
          <span className="product-current">
            {price} {currency}
          </span>
        </div>

        <div className="product-availability">
          Availability: {availability}
        </div>

        <div className="product-actions">
          <button type="button"
	    onClick={ e=> setShowModal( true ) }
            className="buy-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Now
          </button>
        </div>

        {description && (
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {specs && (
          <div className="product-specs">
            {specs}
          </div>
        )}
      </div>
    </div>
  );
}

