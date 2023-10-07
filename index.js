import { X509Certificate } from "crypto";
import fs from "fs";

const x509 = new X509Certificate(fs.readFileSync("cert.pem"));

const commonName = x509.subject.split("CN=")[1].split("\n")[0];
const publicKey = x509.publicKey.export({
  format: "pem",
  type: "spki",
});

console.log(commonName);
console.log(publicKey);
