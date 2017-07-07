import { expect } from 'chai';
import * as td from 'testdouble';

import * as Logless from '../index'

describe('Logless', () => {

  let custom = {}

  const logGroup = {
    Type: 'AWS::Logs::LogGroup',
    Properties: {
      LogGroupName: '/aws/lambda/function'
    }
  }

  const originalLogGroup = Object.assign({}, logGroup);

  const serverless = {
    service: {
      custom: {},
      provider: {
        compiledCloudFormationTemplate: {
          Resources: {
              'FunctionLogGroup': logGroup
          }
        }
      },
      getAllFunctions: () => {
        return ['Function'];
      }
    },
    cli: {
      log: (s: string) => {
        console.log(s);
      }
    }
  }

  describe('without log retention config', () => {
    it('noop', async () => {
      let logless = new Logless(serverless, {})
      logless.configLogRetention()
      expect(logGroup.Properties).to.not.have.property('RetentionInDays');
    });
  });

  describe('with log retention config', () => {
    it('configurates log group', async () => {
      custom = {
        logless: {
          logRetention: 42
        }
      }
      serverless.service.custom = custom

      let logless = new Logless(serverless, {})
      logless.configLogRetention()

      expect(logGroup.Properties).to.have.property('RetentionInDays');
      expect(logGroup.Properties.RetentionInDays).to.eq(42);
    });
  });



});
