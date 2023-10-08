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
- [ ] Extra Bonus: use ECC algorithm instead of RSA

Remarks:

- Make sure node.js script is tailored for lambda with valid handler function for triggering
- You can use any library in node.js for certificates and for AWS clients
- Script, templates, policies won't need to be deployable or executable right away. Just the content is important. They don't need to be working really on AWS or be perfect
- Both Javascript and Typescript are accepted
- Commit index.js/ts and other files into a public GitHub repo.
- Feel free to improvise or make assumptions if you feel stuck.

Reviewing/Expectation:

- The goal of the task is not to come up with something perfectly working or production-ready.
- We will review the approach you took together in the interview where you explain what was your every step and how did you try to do it.
- The important points are
  - If you could find the required libraries and read their documentation to find out the required functions to solve your problem
  - If you can search and understand the basic concepts of what is unknown to you

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
