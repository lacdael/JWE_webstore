import * as React from "react"
import "./index.css"

const IndexPage = () => {
  return (
   <div class="container">
    <div class="card">
      <h1>Static Shop from a Google Merchant Feed</h1>
      <p>
        A Gatsby plugin that converts your Google Merchant product feed into a
        fully static storefront — perfect for small shops and simple product catalogs.
      </p>
    <div class="cta">
      <a href="/shop" class="button">View Demo</a>
    </div>
    </div>
	  <br/>
    <section class="section">
      <div class="card">
        <h2>How it works</h2>
        <ul>
          <li>The plugin reads your Google Merchant feed.</li>
          <li>Product pages are generated at build time.</li>
          <li>A lightweight checkout flow is added to each product.</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="card">
        <h2>JWT Email Checkout</h2>
        <p>
          Instead of a traditional cart and payment gateway, this demo uses a
          JWE email checkout designed for simple sales workflows.
        </p>

        <div class="flow">
          <div class="step">1. The user selects a product.</div>
          <div class="step">
            2. The user enters their delivery details.
          </div>
          <div class="step">
            3. The system generates a JWE Token containing the order data.
          </div>
          <div class="step">
            5. The order is sent via email for processing or payment.
          </div>
        </div>
      </div>
    </section>



    <footer>
      Static Gatsby shop demo · Powered by Google Merchant feeds and JWT checkout
    </footer>
  </div>

  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
