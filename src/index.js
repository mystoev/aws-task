require("dotenv").config();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { X509Certificate, generateKeyPairSync, createSign } = require("crypto");

const {
  CERTIFICATE_FILE,
  BUCKET_NAME,
  TABLE_NAME,
  KEY_ALGORITHM,
  SIGN_ALGORITHM,
} = process.env;

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

  return sign.sign(privateKey, "base64");
};

const writeToDynamo = async (key, data) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      [key]: data,
    },
  });

  const response = await docClient.send(command);
  return response;
};

const main = async () => {
  try {
    const cert = await readCertFromS3();
    const { certPublicKey, commonName } = extractCertInfo(cert);

    const signature = signData(certPublicKey);

    await writeToDynamo(commonName, signature);
    console.log("Success!");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  main: main,
};
