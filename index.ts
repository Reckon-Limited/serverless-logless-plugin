class Logless {
  serverless: any
  options: any

  provider: string
  hooks: {[hook: string]: () => void}

  constructor(serverless: any, options: any) {

    this.serverless = serverless
    this.options = options

    this.provider = 'aws';

    this.hooks = {
      'after:package:compileFunctions': this.configLogRetention,
    }
  }

  configLogRetention = () => {
    if (this.do) {
      this.serverless.cli.log(`Configurating CloudWatch log retention`);

      let Resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;

      this.serverless.service.getAllFunctions().forEach( (name: string) => {

        let logGroup = this.toLogGroup(name);

        if (Resources[logGroup]) {
          this.serverless.cli.log(`Configurating ${logGroup} RetentionInDays: ${this.config.logRetention}`);
          Resources[logGroup].Properties.RetentionInDays = this.config.logRetention
        }
      });
    }
  }

  toLogGroup(n: string) {
    const name = n.charAt(0).toUpperCase() + n.slice(1);
    return `${name}LogGroup`;
  }

  get do() {
    return this.serverless.service.custom && this.serverless.service.custom.logless && this.serverless.service.custom.logless.logRetention
  }

  get config() {
    if (this.do) {
      return this.serverless.service.custom.logless;
    } else {
      this.serverless.cli.log(`No configuration found for Logless`);
      return {};
    }
	}

}

export = Logless;
