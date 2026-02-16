import { graphql, Link } from "gatsby";
import React from "react";
import ProductDetail from "./product-detail";
import OS_PUBLISHING_IMG from '../images/Os_publishing.png';
import "./layout.css";


export function Head(){
	return (
		<title>Product</title>
	);
}

export default function Product({ data }) {
  const p = data.merchantProduct;

  return (
      <div style={{padding:`1em`}}>
	 <img src={ OS_PUBLISHING_IMG } alt="Os Publishing" class="title-img" />
        <ul className="breadcrumb" >
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li>{p.title}</li>
        </ul>
	  <ProductDetail
      title={p.title}
      images={[p.imageUrl]}
      price={p.price}
      originalPrice={p.originalPrice}
      currency={p.currency}
      description={p.description}
      specs={p.specs}
      availability={p.availability}
      buyUrl={p.link}
    /></div>
  );
}

export const query = graphql`
  query ($id: String!) {
    merchantProduct(id: { eq: $id }) {
      title
      description
      price
      currency
      availability
      imageUrl
      link
    }
  }
`;

