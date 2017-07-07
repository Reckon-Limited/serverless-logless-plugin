"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Logless = require("../index");
describe('Logless', () => {
    let custom = {};
    const logGroup = {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
            LogGroupName: '/aws/lambda/function'
        }
    };
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
            log: (s) => {
                console.log(s);
            }
        }
    };
    describe('without log retention config', () => {
        it('noop', () => __awaiter(this, void 0, void 0, function* () {
            let logless = new Logless(serverless, {});
            logless.configLogRetention();
            chai_1.expect(logGroup.Properties).to.not.have.property('RetentionInDays');
        }));
    });
    describe('with log retention config', () => {
        it('configurates log group', () => __awaiter(this, void 0, void 0, function* () {
            custom = {
                logless: {
                    logRetention: 42
                }
            };
            serverless.service.custom = custom;
            let logless = new Logless(serverless, {});
            logless.configLogRetention();
            chai_1.expect(logGroup.Properties).to.have.property('RetentionInDays');
            chai_1.expect(logGroup.Properties.RetentionInDays).to.eq(42);
        }));
    });
});
