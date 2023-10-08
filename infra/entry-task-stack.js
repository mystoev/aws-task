import { RemovalPolicy, Stack, Duration } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export default class EntryTaskStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { BUCKET_NAME, CERTIFICATE_FILE, TABLE_NAME } = props;

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
        name: "candidate-ms.entry-task.dormakaba.com", //Could get this from the cert, but don't want to overcomplicate this
        type: AttributeType.STRING,
      },
    });

    const lambda = new NodejsFunction(this, "TestFunction", {
      timeout: Duration.seconds(10),
      entry: "./src/index.js",
      functionName: "s3-cert-to-dynamo",
      runtime: Runtime.NODEJS_18_X,
      handler: "main",
      environment: {
        TABLE_NAME,
        BUCKET_NAME,
        CERTIFICATE_FILE,
      },
    });

    dynamo.grantWriteData(lambda);
    testBucket.grantRead(lambda);
  }
}
