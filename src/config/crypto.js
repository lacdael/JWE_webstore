const publicKey =`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1w30OecfRCEbLC8/42K
qXyUv4iUz6ySMwUkuvruRgKhvIsmZq4/Gio/ZxGSBkV7QjdVEKx0GsYF+B0snKAF
J7YwvJyjG8pbwk2xv/88MuiRUXi3mzFr+Ihqbd4TzQ/EfBVRAaUdOvBLwtJdUreE
3r+NRHsXt0UvjrENKplojQ4LKNrDs6CcFHcYcW+GtKZCJpgrNbwYGn9ePywH/ygU
1dNQLlh/d+xFNAVnscp5mISxGEFJNykAwMT/Ner0gL2b4v6EqVxzi5iqpMd5/huX
fOvkX42FhpOf35v86XWz19knWy3LldPF2MJ4NIBB02yt6ZfogVjkUC2KmPbPiVTb
7QIDAQAB
-----END PUBLIC KEY-----
`

if (!publicKey) {
	throw new Error("publicKey is not configured");
}

export const PUBLIC_KEY = publicKey.replace(/\\n/g, "\n");
export const ALG = "RSA-OAEP-256";
