declare class Logless {
    serverless: any;
    options: any;
    provider: string;
    hooks: {
        [hook: string]: () => void;
    };
    constructor(serverless: any, options: any);
    configLogRetention: () => void;
    readonly do: any;
    readonly config: any;
}
export = Logless;
