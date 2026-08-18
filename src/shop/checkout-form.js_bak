import React, { useState } from "react";
import CheckoutLine from "./checkout-line";
import "./checkout-form.css";
import "./modal.css";
import Spinner from "./spinner";
import * as jose from 'jose'

export function CheckoutModal({image, title, description, quantity, price, currency, shipping, show}){
	return(
		<div id="modal" >
		<div id="modal-inner" style={{textAlign:`center`}} >

		<CheckoutTabs
		paymentComponent={ <><CheckoutLine
			image={ image }
			title={ title }
			description={ description }
			quantity={ quantity }
			price={ price }
			currency={ currency }
			shipping={ shipping }
			total={ price + shipping }
			/><CheckoutForm title={title} quantity={quantity} /></> }
		crypto1={ <Spinner size={150}/> } />

		<button type="button"
		onClick={ e=> show( false ) }
		className="close-button"
		target="_blank"
		rel="noopener noreferrer"
		style={{
			margin: "4px",
				display: "block",
				padding: "12px 20px",
				borderRadius: "6px",
				textDecoration: "none",
				fontWeight: "bold",
		}} >
		Back
		</button>

		</div>
		</div> );
}

export function CheckoutTabs({
	paymentComponent,
	crypto1,
	crypto2,
}) {
	const [active, setActive] = useState("payment");

	return (
		<div className="checkout">
		<div className="checkout-tabs">
		<button
		className={active === "payment" ? "active" : ""}
		onClick={() => setActive("payment")} >
		Checkout
		</button>
		<button
		className={active === "crypto1" ? "active" : ""}
		onClick={() => setActive("crypto1")} >
		Bank
		</button>
		</div>
		<div className="checkout-content">
		{active === "payment" && paymentComponent}
		{active === "crypto1" && crypto1}
		{active === "crypto2" && crypto2}
		</div>
		</div>
	);
}

const PUBLIC_KEY=`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1w30OecfRCEbLC8/42K
qXyUv4iUz6ySMwUkuvruRgKhvIsmZq4/Gio/ZxGSBkV7QjdVEKx0GsYF+B0snKAF
J7YwvJyjG8pbwk2xv/88MuiRUXi3mzFr+Ihqbd4TzQ/EfBVRAaUdOvBLwtJdUreE
3r+NRHsXt0UvjrENKplojQ4LKNrDs6CcFHcYcW+GtKZCJpgrNbwYGn9ePywH/ygU
1dNQLlh/d+xFNAVnscp5mISxGEFJNykAwMT/Ner0gL2b4v6EqVxzi5iqpMd5/huX
fOvkX42FhpOf35v86XWz19knWy3LldPF2MJ4NIBB02yt6ZfogVjkUC2KmPbPiVTb
7QIDAQAB
-----END PUBLIC KEY-----`

const ALG = "RSA-OAEP-256";

export function CheckoutForm({ title, quantity }){

	const [formData, setFormData] = useState({
		title: title,
		quantity: quantity,
		address: "",
		postcode: "",
		message: ""
	});

	const [serialised, setSerialized] = useState( null );

	async function encrypt( txt  ) {
		const _publicKey = await jose.importSPKI(  PUBLIC_KEY , ALG  )
		const jwe = await new jose.CompactEncrypt(
			new TextEncoder().encode( txt )
		)
			.setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
			.encrypt( _publicKey )

		setSerialized(jwe)

	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
	};

	const SerialData = ({text}) => {
		const [copied, setCopied] = useState(false);

		const copy = ({ text}) => {
			navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		};

		return(
			<><div
			style={{
				wordBreak: "break-all",
					cursor: "pointer",
					fontSize: "0.9rem",
					background: "#f6f6f6",
					padding: "0.7rem",
					borderRadius: "8px",
			}}
			onClick={copy}
			>
			{text} 📋 {copied && "COPIED"}
			</div>
			<a
			href={`mailto:reciever@example.com?subject=Order&body=${text}`} 
			class="submit-button"
			>
			E-mail
			</a></>


		);

	} 

	return ( <>
		{ serialised ? <SerialData text={serialised} /> : <form
			className="checkout-form" onSubmit={handleSubmit}>
			<label>
			Address:
			<input
			type="text"
			name="address"
			value={formData.address}
			onChange={handleChange}
			required
			placeholder="Enter your address"
			/>
			</label>

			<label>
			Postcode:
			<input
			type="text"
			name="postcode"
			value={formData.postcode}
			onChange={handleChange}
			required
			placeholder="Enter postcode"
			/>
			</label>

			<label>
			Message:
			<textarea
			name="message"
			value={formData.message}
			onChange={handleChange}
			placeholder="Optional message"
			rows={4}
			/>
			</label>

			<button type="submit"
			onClick={ e => encrypt( JSON.stringify( formData ) ) } 
			className="submit-button">
			Submit
			</button>
			</form> } </>
	);
}

