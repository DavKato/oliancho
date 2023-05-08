import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HiyodoriStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const assetBucket = new s3.Bucket(this, 'hiyodori', {
			bucketName: 'hiyodori',
		});
	}
}
