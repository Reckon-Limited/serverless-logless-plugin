# logless

less logs for your server less


# Usage

```
yarn add serverless-logless-plugin
```

Add to serverless.yml configuration

```
plugins:  
  - serverless-logless-plugin

custom:
  logless:
    logRetention: 17
```


Log Retention value is in days.

If not present, the default value will be used.
