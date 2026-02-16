import React from "react";
import { graphql, Link } from "gatsby";
import OS_PUBLISHING_IMG from '../images/Os_publishing.png';
import "./layout.css";
import ProductCard from "./product-card";



export function Head(){
	return (
		<title>Shop</title>
	);
}




export default function Shop({ data }) {
  const products = data.allMerchantProduct.nodes;

console.log( products );

  return (
      <div style={{padding:`1em`}}>
	 <img src={ OS_PUBLISHING_IMG } alt="Os Publishing" className="title-img" />
        <ul className="breadcrumb">
        <li><Link to="/">Home</Link></li>
        <li>Shop</li>
        </ul>
        <div id="shop">

<div className="product-grid">
  {products.map(p => (
    <ProductCard
      key={p.id}
      title={p.title}
      price={ p.price }
      currency={ p.currency }
      description={p.description}
      image={p.imageUrl}
      merchant={p.brand || "Store"}
      url={`/shop/${p.slug}`}
      badge={p.salePrice ? "Sale" : null}
      originalPrice={
        p.salePrice ? `${p.price} ${p.currency}` : null
      }
      price={
        p.salePrice
          ? `${p.salePrice} ${p.currency}`
          : `${p.price} ${p.currency}`
      }
    />
  ))}
	</div>
      </div>
    </div>
  );
}

export const query = graphql`
  {
    allMerchantProduct(sort: { fields: title }) {
      nodes {
        id
        title
        slug
        price
        currency
        imageUrl
	description
	}
    }
  }
`;

