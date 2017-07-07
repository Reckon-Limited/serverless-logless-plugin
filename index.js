"use strict";
class Logless {
    constructor(serverless, options) {
        this.configLogRetention = () => {
            if (this.do) {
                this.serverless.cli.log(`Configurating CloudWatch log retention`);
                let Resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
                this.serverless.service.getAllFunctions().forEach((name) => {
                    let logGroup = `${name}LogGroup`;
                    if (Resources[logGroup]) {
                        this.serverless.cli.log(`Configurating ${logGroup} RetentionInDays: ${this.config.logRetention}`);
                        Resources[logGroup].Properties.RetentionInDays = this.config.logRetention;
                    }
                });
            }
        };
        this.serverless = serverless;
        this.options = options;
        this.provider = 'aws';
        this.hooks = {
            'after:package:compileFunctions': this.configLogRetention,
        };
    }
    get do() {
        return this.serverless.service.custom && this.serverless.service.custom.logless && this.serverless.service.custom.logless.logRetention;
    }
    get config() {
        if (this.do) {
            return this.serverless.service.custom.logless;
        }
        else {
            this.serverless.cli.log(`No configuration found for Logless`);
            return {};
        }
    }
}
module.exports = Logless;
