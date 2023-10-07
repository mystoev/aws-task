import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { X509Certificate, generateKeyPairSync, createSign } from "crypto";

const CERTIFICATE_FILE = "cert.pem";
const BUCKET_NAME = "d71c3340-64f8-11ee-8c99-0242ac120002";
const KEY_ALGORITHM = "rsa";
const SIGN_ALGORITHM = "sha256";

const readCertFromS3 = async () => {
  const client = new S3Client({});
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: CERTIFICATE_FILE,
  });

  const response = await client.send(command);
  return response.Body.transformToByteArray();
};

const extractCertInfo = (cert) => {
  const x509 = new X509Certificate(cert);
  const commonName = x509.subject.split("CN=")[1].split("\n")[0];

  const certPublicKey = x509.publicKey.export({
    format: "pem",
    type: "spki",
  });

  return { commonName, certPublicKey };
};

const signData = (data) => {
  const { privateKey } = generateKeyPairSync(KEY_ALGORITHM, {
    modulusLength: 2048,
  });

  const sign = createSign(SIGN_ALGORITHM);
  sign.update(data);
  sign.end();

  return sign.sign(privateKey);
};

const writeToDynamo = async (data, publicKey) => {
  throw Error("not implemented, yet");
};

export const main = async () => {
  try {
    const cert = await readCertFromS3();
    const { certPublicKey, commonName } = extractCertInfo(cert);

    const signature = signData(certPublicKey);

    await writeToDynamo(signature, certPublicKey);
    console.log("Success!");
  } catch (err) {
    console.error(err);
  }
};

main();
