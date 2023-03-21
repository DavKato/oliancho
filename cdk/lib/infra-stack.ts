import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 } from 'aws-cdk-lib';

export class InfraStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		new aws_s3.Bucket(this, 'test', {
			bucketName: 'test',
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		// The code that defines your stack goes here

		// example resource
		// const queue = new sqs.Queue(this, 'InfraQueue', {
		//   visibilityTimeout: cdk.Duration.seconds(300)
		// });
	}
}
