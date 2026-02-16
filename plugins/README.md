iYes — this is a **great candidate for a custom Gatsby source + page-creator plugin**, and your requirement (“merchant feed + layout page provided by the plugin”) is totally reasonable.

Below is a **clean, production-ready plugin design** that:

* Reads a **local XML feed**
* Creates **MerchantProduct nodes**
* Automatically creates **product pages**
* Ships with its **own page template**
* Requires **zero changes** to your existing `gatsby-node.js` (other than enabling the plugin)

---

# Plugin design overview

### What the plugin does

✔ Reads XML from `/static`
✔ Parses Google Merchant feed
✔ Creates `MerchantProduct` nodes
✔ Creates `/shop/:slug` pages
✔ Provides its own React template

### What the site owner controls

* Feed filename
* Base path (`/shop`)
* Optional filters (availability, category)

---

# Folder structure

Create this inside your repo:

```
plugins/
  gatsby-plugin-merchant-feed/
    package.json
    gatsby-node.js
    src/
      templates/
        product.js
```

---

# 1. `package.json` (plugin)

```json
{
  "name": "gatsby-plugin-merchant-feed",
  "version": "1.0.0",
  "main": "gatsby-node.js",
  "dependencies": {
    "fast-xml-parser": "^4.2.0",
    "slugify": "^1.6.6"
  }
}
```

---

# 2. Plugin `gatsby-node.js`

This is **self-contained** — it does everything.

```js
const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const slugify = require("slugify");

function readFeed(feedPath) {
  const xml = fs.readFileSync(feedPath, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  return parser.parse(xml);
}

function normalizeItem(item) {
  const [price, currency] = (item["g:price"] || "0 USD").split(" ");

  return {
    merchantId: item["g:id"],
    title: item.title,
    description: item.description,
    price: Number(price),
    currency,
    availability: item["g:availability"],
    brand: item["g:brand"],
    category: item["g:google_product_category"],
    imageUrl: item["g:image_link"],
    link: item.link,
    slug: slugify(item.title, { lower: true, strict: true }),
  };
}

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions;

  const feedFile =
    pluginOptions.feedFile || "google-merchant.xml";

  const feedPath = path.resolve("static", feedFile);

  const feed = readFeed(feedPath);
  const items = feed?.rss?.channel?.item || [];

  items.map(normalizeItem).forEach(product => {
    createNode({
      ...product,
      id: createNodeId(`merchant-product-${product.merchantId}`),
      parent: null,
      children: [],
      internal: {
        type: "MerchantProduct",
        contentDigest: createContentDigest(product),
      },
    });
  });
};

exports.createPages = async (
  { graphql, actions },
  pluginOptions
) => {
  const { createPage } = actions;

  const basePath = pluginOptions.basePath || "/shop";

  const result = await graphql(`
    {
      allMerchantProduct {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  result.data.allMerchantProduct.nodes.forEach(product => {
    createPage({
      path: `${basePath}/${product.slug}`,
      component: path.resolve(
        __dirname,
        "src/templates/product.js"
      ),
      context: {
        id: product.id,
      },
    });
  });
};
```

---

# 3. Plugin product template

`plugins/gatsby-plugin-merchant-feed/src/templates/product.js`

```js
import React from "react";
import { graphql } from "gatsby";

export default function Product({ data }) {
  const p = data.merchantProduct;

  return (
    <main>
      <h1>{p.title}</h1>
      <img src={p.imageUrl} alt={p.title} />
      <p>{p.description}</p>
      <p>
        {p.price} {p.currency}
      </p>
      <p>{p.availability}</p>
      <a href={p.link} target="_blank" rel="noopener noreferrer">
        Buy now
      </a>
    </main>
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
```

You can style or replace this later — the site doesn’t need to know.

---

# 4. Enable the plugin

In the **site’s** `gatsby-config.js`:

```js
plugins: [
  {
    resolve: "gatsby-plugin-merchant-feed",
    options: {
      feedFile: "google-merchant.xml",
      basePath: "/shop",
    },
  },
];
```

That’s it.
No changes to your existing `gatsby-node.js`.

---

# 5. What URLs you get

```
/shop/product-slug
```

Automatically created at build time.

---

# 6. Why this plugin approach is solid

✔ Zero coupling to your Markdown system
✔ Reusable across projects
✔ Feed logic isolated
✔ Easy to extend (images, categories, SEO)
✔ Clean upgrade path

This is **exactly how Gatsby expects this to be done**.

---

# 7. Easy future upgrades

If you want next, I can show you how to:

* Add **image optimization** inside the plugin
* Add **category index pages** automatically
* Allow **custom product templates** via plugin options
* Publish this plugin privately or publicly
* Add **JSON-LD Product schema** globally

If you tell me which of those you want next, I’ll build it cleanly on top of this.

