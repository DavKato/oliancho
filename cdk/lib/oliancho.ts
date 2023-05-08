import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_cognito as cognito, aws_certificatemanager as acm } from 'aws-cdk-lib';
import config from '../../.appconfig';

const LOGIN_URL = `https://${config.domainName}/login}`;
const CALLBACK_URL = `https://${config.domainName}/callback}`;

interface OliAnchoStackProps extends cdk.StackProps {
	certificate: acm.Certificate;
}

export class OliAnchoStack extends cdk.Stack {
	public readonly userPoolDomain: cognito.UserPoolDomain;

	constructor(scope: Construct, id: string, props: OliAnchoStackProps) {
		super(scope, id, props);

		const userPool = new cognito.UserPool(this, config.domainName, {
			userPoolName: config.domainName,
			signInAliases: {
				username: true,
				email: true,
				preferredUsername: true,
			},
			signInCaseSensitive: false,
			keepOriginal: {
				email: true,
			},
			deviceTracking: {
				challengeRequiredOnNewDevice: true,
				deviceOnlyRememberedOnUserPrompt: false,
			},
			standardAttributes: {
				profilePicture: {},
			},
			userInvitation: {
				emailSubject: 'OliAnchoへようこそ！',
				emailBody: `
					<h1>{username}さん、新しく生まれ変わったOliAnchoへようこそ！</h1>
					<p>あなたの初期パスワードは{####}です。</p>
					<p><a href="${LOGIN_URL}">ここ</a>からログインしてみてね。</p>
				`,
			},
		});

		const googleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'Google', {
			userPool,
				email: cognito.ProviderAttribute.GOOGLE_EMAIL,
				preferredUsername: cognito.ProviderAttribute.GOOGLE_NAME,
				profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
			},
		});

		this.userPoolDomain = userPool.addDomain(config.domainName, {
			customDomain: {
				domainName: config.domainName,
				certificate: props.certificate,
			},
		});

		const client = userPool.addClient('oliancho-client', {
			userPoolClientName: 'oliancho-client',
			preventUserExistenceErrors: true,
			oAuth: {
				// ? TODO:
				callbackUrls: [LOGIN_URL],
				logoutUrls: [LOGIN_URL],
				scopes: [],
				flows: {
					authorizationCodeGrant: true,
				},
			},
		});

		client.node.addDependency(googleProvider);
	}
}
