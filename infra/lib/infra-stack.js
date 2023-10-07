import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";

import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const { BUCKET_NAME, TABLE_NAME } = process.env;
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

    new TableV2(this, "Table", {
      tableName: TABLE_NAME,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: "candidate-ms.entry-task.dormakaba.com",
        type: AttributeType.STRING,
      },
    });
  }
}
