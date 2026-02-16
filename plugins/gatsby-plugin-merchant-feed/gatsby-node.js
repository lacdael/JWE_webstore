const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const slugify = require("slugify");


function resolveTemplate(templatePath, fallback) {
  if (!templatePath) return fallback;

  return path.resolve(process.cwd(), templatePath);
}


exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MerchantProduct implements Node {
      merchantId: String!
      title: String!
      description: String
      price: Float
      currency: String
      availability: String
      brand: String
      category: String
      imageUrl: String
      link: String
      slug: String!
    }
  `);
};

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
    description: item["g:description"],
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

  const feedFile = pluginOptions.feedFile || "google-merchant.xml";

  const feedPath = path.resolve("static", feedFile);

  const feed = readFeed(feedPath);
  let items = feed?.rss?.channel?.item || [];
  if (!Array.isArray(items)) {
     items = [items];
  }

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

const createPagesOld = async (
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




exports.createPages = async (
  { graphql, actions },
  pluginOptions
) => {
  const { createPage } = actions;

  const basePath = pluginOptions.basePath || "/shop";

  const productTemplate = resolveTemplate(
    pluginOptions.productTemplate,
    path.resolve(__dirname, "src/templates/product.js")
  );

  const shopTemplate = resolveTemplate(
    pluginOptions.shopTemplate,
    path.resolve(__dirname, "src/templates/shop.js")
  );


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


  // Create product pages
  result.data.allMerchantProduct.nodes.forEach(product => {
    createPage({
      path: `${basePath}/${product.slug}`,
      component: productTemplate,
      context: {
        id: product.id,
      },
    });
  });

  // Create shop landing page
  createPage({
    path: basePath,
    component: shopTemplate,
  });
};

