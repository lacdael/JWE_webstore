/**
 * Secure Email JWE Processor
 * --------------------------
 *
 * This script performs two main tasks:
 *
 * 1) Key management
 *    - Checks for RSA public/private keys in the .env file.
 *    - If not found, it generates a new RSA-OAEP-256 key pair.
 *    - The keys are exported in PEM format and appended to the .env file.
 *
 * 2) Email decryption
 *    - Connects to an IMAP email account using credentials from .env.
 *    - Reads messages from the INBOX.
 *    - Attempts to decode each message body (quoted-printable).
 *    - Tries to decrypt the message as a JWE using the private key.
 *    - If successful, prints the decrypted payload to the console.
 *
 * Environment variables required in .env:
 *
 *   EMAIL_ADDRESS=your@email.com
 *   EMAIL_PASS=yourpassword
 *   EMAIL_SERVER=imap.yourserver.com
 *   EMAIL_PORT=993
 *   EMAIL_TLS=true
 *
 * Optional (auto-generated if missing):
 *
 *   PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
 *   PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
 *
 * Usage:
 *
 *   node script.js
 *
 * Notes:
 * - Ensure .env is not committed to version control.
 * - The script expects incoming emails to contain a JWE in the body.
 * - Decrypted results are printed to stdout.
 */

import * as jose from 'jose';
import * as dotenv from 'dotenv';
import { appendFile } from 'node:fs/promises';
import imaps from 'imap-simple';
import _ from 'lodash';
import QuotedPrintable from '@ronomon/quoted-printable';

const PRIVATE_KEY = "PRIVATE_KEY";
const PUBLIC_KEY = "PUBLIC_KEY";
const ALG = "RSA-OAEP-256";
const EMAIL_PASS = "EMAIL_PASS";
const EMAIL_ADDRESS = "EMAIL_ADDRESS";
const EMAIL_SERVER = "EMAIL_SERVER";
const EMAIL_PORT = "EMAIL_PORT";
const EMAIL_TLS = "EMAIL_TLS";

async function main() {
    const ENV_VALUES = dotenv.config();
    const ENV = ENV_VALUES.parsed || {};

    let _privateKey = null;
    let _publicKey = null;

    // ------------------------------------------------------------------
    // Key generation or loading
    // ------------------------------------------------------------------
    if (!(PUBLIC_KEY in ENV) || !(PRIVATE_KEY in ENV)) {
        console.log("Generating RSA key pair...");

        const { publicKey, privateKey } = await jose.generateKeyPair(ALG);
        _privateKey = privateKey;
        _publicKey = publicKey;

        const pkcs8Pem = await jose.exportPKCS8(privateKey);
        const spkiPem = await jose.exportSPKI(publicKey);

        const data =
            `\n${PUBLIC_KEY}="${spkiPem}"\n${PRIVATE_KEY}="${pkcs8Pem}"\n`;

        await appendFile('./.env', data);
        console.log("Keys appended to .env");
    } else {
        _privateKey = await jose.importPKCS8(ENV[PRIVATE_KEY], ALG);
        _publicKey = await jose.importSPKI(ENV[PUBLIC_KEY], ALG);
    }

    // ------------------------------------------------------------------
    // Example encryption (for testing)
    // ------------------------------------------------------------------
    const jwe = await new jose.CompactEncrypt(
        new TextEncoder().encode(
            JSON.stringify({
                "t-shirt": { qty: 2 },
                address1: "10 Nowhere Street",
                adress2: "",
                postCode: "ID24 8NO",
                txn: "124123423435153",
                country: "AllTheSame"
            })
        )
    )
        .setProtectedHeader({ alg: ALG, enc: 'A256GCM' })
        .encrypt(_publicKey);

    console.log("Example encrypted JWE:");
    console.log(jwe);

    // ------------------------------------------------------------------
    // Email processing
    // ------------------------------------------------------------------
    if (
        ENV[EMAIL_ADDRESS] &&
        ENV[EMAIL_PASS] &&
        ENV[EMAIL_SERVER] &&
        ENV[EMAIL_PORT]
    ) {
        console.log("Getting mail ...");

        const config = {
            imap: {
                user: ENV[EMAIL_ADDRESS],
                password: ENV[EMAIL_PASS],
                host: ENV[EMAIL_SERVER],
                port: parseInt(ENV[EMAIL_PORT], 10),
                tls: ENV[EMAIL_TLS] === 'true',
                authTimeout: 5000
            }
        };

        try {
            const connection = await imaps.connect(config);
            await connection.openBox('INBOX');

            const searchCriteria = ['ALL'];
            const fetchOptions = {
                bodies: ['HEADER', 'TEXT'],
            };

            const messages = await connection.search(
                searchCriteria,
                fetchOptions
            );

            for (const item of messages) {
                const part = _.find(item.parts, { which: "TEXT" });
                if (!part) continue;

                try {
                    const bufferEncoded = Buffer.from(part.body, 'ascii');
                    const buffer = QuotedPrintable.decode(
                        bufferEncoded,
                        { qEncoding: false }
                    );
                    const text = buffer.toString('utf-8');

                    const { plaintext, protectedHeader } =
                        await jose.compactDecrypt(text, _privateKey);

                    console.log("Decrypted:");
                    console.log(protectedHeader);
                    console.log(
                        new TextDecoder().decode(plaintext)
                    );
                    console.log("===========================");
                } catch (e) {
                    // Not a valid JWE or decode error
                    // Silent fail to keep behaviour similar
                }
            }

            connection.end();
        } catch (err) {
            console.error("IMAP error:", err.message);
        }
    } else {
        console.log("Email config not present in .env");
    }
}

main().catch(err => {
    console.error("Fatal error:", err);
});


