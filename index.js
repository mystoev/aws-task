import { X509Certificate, generateKeyPairSync, createSign } from "crypto";
import fs from "fs";

const CERTIFICATE_FILE = "cert.pem";
const KEY_ALGORITHM = "rsa";
const SIGN_ALGORITHM = "sha256";

const x509 = new X509Certificate(fs.readFileSync(CERTIFICATE_FILE));

const commonName = x509.subject.split("CN=")[1].split("\n")[0];
const certPublicKey = x509.publicKey.export({
  format: "pem",
  type: "spki",
});

console.log(commonName);
console.log(certPublicKey);

const { privateKey } = generateKeyPairSync(KEY_ALGORITHM, {
  modulusLength: 2048,
});

const sign = createSign(SIGN_ALGORITHM);
sign.update(certPublicKey);
sign.end();

const signature = sign.sign(privateKey);
console.log("Signature: ", signature);
