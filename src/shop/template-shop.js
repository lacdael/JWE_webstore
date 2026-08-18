import React from "react";
import { graphql, Link } from "gatsby";
import SEO from '../components/seo'
import "../components/layout.css"
import ProductCard from "./product-card";


export default function Shop({ data }) {
  const products = data.allMerchantProduct.nodes;
  const shopName = data.site.siteMetadata.shopName;
  const shopHeaderImage = data.site.siteMetadata.shopHeaderImage;

  return (
      <div style={{padding:`1em`}}>
	 <img src={ shopHeaderImage } alt={ shopName } className="title-img" />
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
      //price={ p.price }
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

export function Head({ location }) {
  return (
    <SEO
      title="Poetry and Writing Excerpts"
      description="Exerpts from poetry collections, and misc. writing from Christian Lacdael"
      pathname={location.pathname}
    />
  );
}



// new API:  allMerchantProduct(sort: {title: ASC}) {
export const query = graphql`
  query {
    site {
      siteMetadata {
        shopHeaderImage
	shopName
	siteUrl
      }
    }
    allMerchantProduct(sort: { title: ASC }) {
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
