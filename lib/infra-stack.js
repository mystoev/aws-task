import "dotenv/config";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

const {
  BUCKET_NAME,
  CERTIFICATE_FILE,
  TABLE_NAME,
  KEY_ALGORITHM,
  SIGN_ALGORITHM,
} = process.env;
export default class InfraStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const testBucket = new Bucket(this, "TestBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: BUCKET_NAME,
    });

    new BucketDeployment(this, "DeployCertificate", {
      sources: [Source.asset("./assets/")],
      destinationBucket: testBucket,
    });

    const dynamo = new TableV2(this, "Table", {
      tableName: TABLE_NAME,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: "candidate-ms.entry-task.dormakaba.com",
        type: AttributeType.STRING,
      },
    });

    const lambda = new NodejsFunction(this, "Test", {
      entry: "./src/index.js",
      functionName: "s3-cert-to-dynamo",
      runtime: Runtime.NODEJS_18_X,
      handler: "main",
      environment: {
        TABLE_NAME,
        BUCKET_NAME,
        CERTIFICATE_FILE,
        KEY_ALGORITHM,
        SIGN_ALGORITHM,
      },
      bundling: {
        externalModules: [
          "@aws-sdk/client-s3",
          "@aws-sdk/client-dynamodb",
          "@aws-sdk/lib-dynamodb",
        ],
      },
    });

    dynamo.grantWriteData(lambda);
    testBucket.grantRead(lambda);
  }
}
