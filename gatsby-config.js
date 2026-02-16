/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
	siteMetadata: {
		title: `JWE_webstore`,
		siteUrl: `https://www.yourdomain.tld`,
	},
	plugins: [
		
		{ 
			resolve: "gatsby-plugin-merchant-feed",
			options: {
				feedFile: "google-merchant-feed.xml",
				basePath: "/shop",
				productTemplate: "src/templates/template-product.js",
				shopTemplate: "src/templates/template-shop.js",
			}

		}
	],
}
