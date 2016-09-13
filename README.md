Require
```
node >= 6.2.2
npm >= 3.9.5
```

How to run
```
$ npm install -g webpack webpack-dev-server
$ npm install
```

THEME
```
http://milestone.nyasha.me/latest/angular/
```

DEVELOPMENT
```
// Run dev server
$ npm run server
```

BUILD
```
// Build
// profile is: production, staging or nois, please change profile config in config/deploy.config.js
$ npm run build:<profile>
```

DEPLOYMENT
```
// profile is: production, staging or nois, please change profile config in config/deploy.config.js

// Build and deploy
$ npm run build:deploy:<profile>

// Deploy only
$ npm run deploy:<profile>
```

Trouble Shooting:
Running
1. Fix npm version: install npm version 3.9.5 by `$ npm install -g npm@3.9.5`
2. [$injector:unpr] Unknown provider: eProvider <- e => missing /*ngInject*/



Error while building:
1. ModuleNotFoundError: Module not found: Error: Can't resolve 'abc' in 'E:\...\webapp-starter-angular-bootstrap'
 - module 'abc' never be used, remove 'abc' module from entry (webpack.common.js)