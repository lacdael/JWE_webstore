/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
	siteMetadata: {
		title: `JWE_webstore`,
		siteUrl: `https://www.yourdomain.tld`,
		shopHeaderImage:"/shopHeader.png",
		shopName:"Os Publishing",
		author: "me",
	        image: "/logo.png",
        	imageWidth: 64,
        	imageHeight: 64
	},
	plugins: [
		
		{ 
			resolve: "gatsby-plugin-merchant-feed",
			options: {
				feedFile: "google-merchant-feed.xml",
				basePath: "/shop",
				productTemplate: "src/shop/template-product.js",
				shopTemplate: "src/shop/template-shop.js",
			}

		}
	],
}
