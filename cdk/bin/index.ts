// import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DomainStack } from '../lib/domain';
import { OliAnchoStack } from '../lib/oliancho';
import config from '../../.appconfig';

const { account, region } = config;
const env = { account, region };

const app = new cdk.App();

const domainstack = new DomainStack(app, 'DomainStack', { env });
cdk.Tags.of(domainstack).add('Project', 'Domain');

const oliancho = new OliAnchoStack(app, 'OliAnchoStack', { env, certificate: domainstack.certificate });

cdk.Tags.of(oliancho).add('Project', 'OliAncho');
