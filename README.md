# Static Shop from a Google Merchant Feed

This Gatsby plugin turns a Google Merchant product feed into a fully static, high-performance storefront. It is designed for small shops, simple product catalogs, and low-volume sales where a full e-commerce platform would be unnecessary.

---

## How It Works

1. The plugin reads your Google Merchant feed.
2. Product pages are generated at build time.
3. Each product includes a lightweight checkout form.

### JWE Email Checkout

1. The user selects a product.
2. The user enters delivery details.
3. A JSON Web Enctyption token is generated with the order data.
5. The order is sent via email for processing or payment.

---

## Quick Start

### 1. Clone the demo

```bash
git clone https://github.com/your-username/gatsby-static-shop-demo.git
cd gatsby-static-shop-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your feed

Edit the feed URL in:

```
gatsby-config.js
```

Example:

```js
{
  resolve: "gatsby-plugin-static-merchant-shop",
  options: {
    feedUrl: "https://example.com/merchant-feed.xml"
  }
}
```

---

### 4. Run the development server

```bash
npm run develop
```
---

### 5. Build the static site

```bash
npm run build
```

---

## Email Order Processor (JWE Script)

This demo includes a small scripts/getOrders.js script that retrieves and decrypts orders sent via email.

### What it does

* Connects to an IMAP mailbox
* Reads incoming order emails
* Decrypts JWE payloads using your private key
* Prints the order data to the console

### Configure environment

Create a `.env` file:

```
EMAIL_ADDRESS=your@email.com
EMAIL_PASS=yourpassword
EMAIL_SERVER=imap.yourserver.com
EMAIL_PORT=993
EMAIL_TLS=true
```

Keys are optional. If missing, the script will generate them:

```
PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```
---

### Run the email processor

```bash
node getOrders.js
```

---
