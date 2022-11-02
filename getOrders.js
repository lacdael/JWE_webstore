import * as jose from 'jose'
import * as dotenv from 'dotenv'
import { appendFile } from 'node:fs';
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

const ENV_VALUES = dotenv.config();

//console.log(` ${ JSON.stringify( dotenv.config(), null ,2 ) } `);

var _privateKey = null;
var _publicKey = null;

if ( ! ( PUBLIC_KEY in ENV_VALUES["parsed"] ) ) {

    const { publicKey, privateKey } = await jose.generateKeyPair('RSA-OAEP-256')
    console.log(publicKey)
    console.log(privateKey)
    _privateKey = privateKey;
    _publicKey = publicKey;

    const pkcs8Pem = await jose.exportPKCS8(privateKey)
    console.log(pkcs8Pem)
    const spkiPem = await jose.exportSPKI(publicKey)
    console.log(spkiPem)

    let data = `${PUBLIC_KEY}="${spkiPem}"\n${PRIVATE_KEY}="${pkcs8Pem}"`;

    appendFile('./.env', data , (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });

} else {
    _privateKey = await jose.importPKCS8( ENV_VALUES["parsed"][ PRIVATE_KEY ] , ALG );
    _publicKey = await jose.importSPKI( ENV_VALUES["parsed"][ PUBLIC_KEY ] , ALG  )
}

const jwe = await new jose.CompactEncrypt(
    new TextEncoder().encode( JSON.stringify( { "t-shirt":{"qty":2},"address1":"10 Nowhere Street","adress2":"","postCode":"ID24 8NO","txn":"124123423435153","country":"AllTheSame"} ) )
)
    .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
    .encrypt(_publicKey)


if (
    EMAIL_ADDRESS in ENV_VALUES["parsed"] &&
    EMAIL_PASS in ENV_VALUES["parsed"] &&
    EMAIL_SERVER in ENV_VALUES["parsed"] &&
    EMAIL_PORT in ENV_VALUES["parsed"]
) {
    console.log("Getting mail ...");
    var config = {
        imap: {
            user: ENV_VALUES["parsed"][ EMAIL_ADDRESS ],
            password: ENV_VALUES["parsed"][ EMAIL_PASS ],
            host: ENV_VALUES["parsed"][ EMAIL_SERVER ],
            port: parseInt( ENV_VALUES["parsed"][ EMAIL_PORT ]  ),
            tls: 'true' === ENV_VALUES["parsed"][ EMAIL_TLS ] ,
            authTimeout: 1000
        }
    };


    imaps.connect(config).then(function (connection) {
        return connection.openBox('INBOX').then(function () {
            var searchCriteria = ['1:5'];
            var fetchOptions = {
                bodies: ['HEADER', 'TEXT'],
            };
            return connection.search(searchCriteria, fetchOptions).then(function (messages) {
                messages.forEach(function (item) {

                    var all = _.find(item.parts, { "which": "TEXT" })
                    var options = { qEncoding: false };
                    var bufferEncoded = Buffer.from( all.body  , 'ascii');
                    var buffer = QuotedPrintable.decode(bufferEncoded, options);
                    const text = buffer.toString('utf-8');

                    jose.compactDecrypt( text , _privateKey).then( ( { plaintext , protectedHeader } ) => {
                        try{
                         console.log("Decrypted: ");
                        console.log(protectedHeader)
                        console.log(new TextDecoder().decode(plaintext))
                        console.log("===========================");
                        } catch ( e  ) {
                            console.error( e );
                        }
                     }).catch( e => {
                         console.log( text );
                        console.log("===========================");
                     });
                });
            });
        });
    });

} else {
    console.log("NOT");

}

