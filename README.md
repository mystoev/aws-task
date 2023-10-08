# Overview

## Prerequisites

You would need to have AWS CDK CLI installed

## With existing AWS infrastructure

Just add your AWS credentials, so the AWS CDK can read them, and run:

```sh
npm i # if you haven't already done so
npm run local
```

## Without AWS infrastructure

Run the CloudFormation scripts by:

```sh
npm run synth
npm run deploy # and accept the changes
```

Later you could tear down the infrastructure by:

```sh
npm run destroy
```

> The `destroy` script will explicitly remove the S3 and DynamoDB table, event if they already existed in your account!

# Testing language/library usage & research with little AWS knowledge

Write a node.js script (that will run on AWS Lambda):

- [x] Reading an x509 Certificate(that is in PEM format) from S3(doesn't matter where in S3)
- [x] Extracts public key from the certificate
- [x] Extracts the CommonName from the certificate subject
- [x] Generates a private key using RSA algorithm
- [x] Signs the Public Key you have extracted with the private key you have generated
- [x] Writes the encrypted content to DynamoDB with Hash Key equals CommonName

Bonus (if you finish earlier than expected):

- [x] Write [README](http://readme.md/) explaining how to run this locally
- [x] Write CloudFormation template for creating S3 and DynamoDB needed for this script.
- [x] Write IAM Policy template with min requirements for accessing s3 and DynamoDB.
- [x] Extra Bonus: use ECC algorithm instead of RSA
