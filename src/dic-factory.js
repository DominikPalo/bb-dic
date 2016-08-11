const GeneratorProxyTrap = require('./generator-proxy-trap');

module.exports = class DicFactory {
  static createGeneratorProxy(fn, params) {
    return new Proxy({}, new GeneratorProxyTrap(fn, params));
  }

  static createCallbackPromise(fn) {
    let resolve, reject;
    const ready = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    fn(err => err ? reject(err) : resolve());
    return ready;
  }

  static createEmitterPromise(emitter, resolveEvent, rejectEvent) {
    let resolve, reject;
    const ready = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });

    emitter.once(resolveEvent, () => {
      resolve();
    });

    if (rejectEvent) {
      emitter.once(rejectEvent, (err) => {
        reject(err);
      });
    }

    return ready;
  }
};
