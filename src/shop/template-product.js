import { graphql, Link } from "gatsby";
import React from "react";
import ProductDetail from "./product-detail";
import SEO from '../components/seo'


export default function Product({ data }) {
  const p = data.merchantProduct;
  const shopName = data.site.siteMetadata.shopName;
  const shopHeaderImage = data.site.siteMetadata.shopHeaderImage;
  const siteUrl = data.site.siteMetadata.siteUrl;
  const productUrl = `${siteUrl}/shop/${p.slug}`;
  const availability = {
    "in stock": "https://schema.org/InStock",
    "preorder": "https://schema.org/PreOrder",
    "out of stock": "https://schema.org/OutOfStock"
  }[String(p.availability).toLowerCase()] || "https://schema.org/InStock";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": p.title,
    "description": p.description,
    "url": productUrl,
    "image": p.imageUrl ? [p.imageUrl] : undefined,
    "sku": p.merchantId,
    "category": p.category,
    "brand": {
      "@type": "Brand",
      "name": p.brand || "Os Publishing"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "price": p.price,
      "priceCurrency": p.currency,
      "availability": availability,
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
      <div style={{padding:`1em`}}>
	 <img src={ shopHeaderImage } alt={ shopName } className="title-img" />
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

export function Head({ data, location }) {
  const p = data.merchantProduct;
  const siteUrl = data.site.siteMetadata.siteUrl;
  const productUrl = `${siteUrl}/shop/${p.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": p.title,
    "description": p.description,
    "url": productUrl,
    "image": p.imageUrl ? [p.imageUrl] : undefined,
    "sku": p.merchantId,
    "category": p.category,
    "brand": { "@type": "Brand", "name": p.brand || "Os Publishing" },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "price": p.price,
      "priceCurrency": p.currency,
      "availability": ({
        "in stock": "https://schema.org/InStock",
        "preorder": "https://schema.org/PreOrder",
        "out of stock": "https://schema.org/OutOfStock"
      })[String(p.availability).toLowerCase()] || "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <SEO
      title={p.title}
      description={p.description}
      image={p.imageUrl}
      imageAlt={p.title}
      what="product"
      schemaMarkup={schema}
      pathname={location.pathname}
    />
  );
}

export const query = graphql`
  query ($id: String!) {
    site {
      siteMetadata {
        shopHeaderImage
	shopName
	siteUrl
      }
    }
    merchantProduct(id: { eq: $id }) {
      merchantId
      title
      description
      price
      currency
      availability
      brand
      category
      imageUrl
      link
      slug
    }
  }
`;
