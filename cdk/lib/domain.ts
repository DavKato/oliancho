import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_route53 as r53, aws_certificatemanager as acm } from 'aws-cdk-lib';
import config from '../../.appconfig';

export class DomainStack extends cdk.Stack {
	public readonly certificate: acm.Certificate;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const hostedZone = new r53.HostedZone(this, 'oliancho-hosted-zone', {
			zoneName: config.domainName,
			comment: 'OliAncho main domain hosted zone',
		});

		this.certificate = new acm.Certificate(this, 'main-domain', {
			domainName: config.domainName,
			certificateName: 'OliAncho main domain',
			validation: acm.CertificateValidation.fromDns(hostedZone),
			subjectAlternativeNames: [`*.${config.domainName}`],
		});
	}
}
