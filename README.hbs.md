# bb-dic

A dependency injection container.

# Installation

```
npm install matuszeman/bb-dic
```

# Usage

For ES5 compatible implementation use `require('bb-dic/es5')`.

See `examples` folder for full usage examples.

## Sync usage

```
class MyService {
  constructor(myServiceOpts) {
    this.options = myServiceOpts;
  }

  showOff() {
    console.log('My options are:', this.options);
  }
}

const {Dic} = require('bb-dic');
const dic = new Dic();

// register all instances
dic.registerInstance('myServiceOpts', { some: 'thing' });
dic.registerClass('myService', MyService);
dic.registerFactory('myApp', function(myService) {
  return function() {
    // some application code
    myService.showOff();
  }
});

// use it
const app = dic.get('myApp');
app();
```

## Async usage

You might want to use classes which needs to be initialized asynchronously or various instances which needs async instantiation.
```
const {Dic} = require('bb-dic');
const dic = new Dic();

class AsyncService {
  async asyncInit() {
    // some async await calls to get this instance intialized (or promise can be used too!)
  }

  showOff() {
    console.log('Pefect, all works!');
  }
}
dic.registerClass('asyncService', AsyncService);

dic.registerAsyncFactory('asyncMsg', async function() {
  // some async calls needed to create an instance of this service
  return 'Async helps the server.';
})

dic.registerFactory('myApp', function(asyncService, asyncMsg) {
  return function() {
    // some application code with all services ready
    myService.showOff();
    console.log(asyncMsg);
  }
});

// Initialize and instantiate all async services
dic.asyncInit().then(() => {
  const app = dic.get('myApp');
  app();
});
```

# API

{{>main}}