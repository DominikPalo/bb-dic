const _ = require('lodash');
const nodePath = require('path');
const globby = require('globby');

/**
 * Dic loader
 *
 * @example
 * const {Dic, DicLoader} = require('bb-dic');
 * const dic = new Dic()
 *
 * const loader = new DicLoader({
 *   rootDir: __dirname //if not specified process.cwd() is used
 * });
 *
 * //loads all .js files under src folder
 * loader.loadPath('src/*.js');
 */
class DicLoader {
  /**
   * @param {Object} opts
   * @param {string} opts.rootDir Absolute path to root folder of source files. Default: `process.cwd()`
   */
  constructor(opts = {}) {
    this.options = _.defaults(opts, {
      rootDir: process.cwd(),
      debug: false
    });
  }

  /**
   * Load all instances/factories/classes to {@link Dic}.
   *
   * File types and what they should export
   * - name.js -> class
   * - name.factory.js -> factory
   * - name.async-factory.js -> async factory
   * - name.instance.js -> instance
   *
   *
   * File name dictates what name the service will be registered as.
   * E.g. `my-service.js` service would become registered as `myService` => file name is camelCased.
   *
   * @example // Registers all services under `CWD/src` folder.
   *
   * const {Dic, DicLoader} = require('bb-dic');
   * const dic = new Dic();
   * const loader = new DicLoader();
   * loader.loadPath(dic, 'src/*.js');
   *
   * module.exports = dic;
   *
   * @param {Dic} dic
   * @param {string} path glob expression {@link https://www.npmjs.com/package/globby}
   */
  loadPath(dic, path) {
    const ret = globby.sync(path, {
      cwd: this.options.rootDir
    });
    for (const p of ret) {
      const path = this.options.rootDir + '/' + p;
      const mod = require(path);
      const basename = nodePath.basename(p, '.js');

      let type = 'class';
      let name =  _.camelCase(basename);

      const match = basename.match(/(.*)\.(factory|async-factory|instance)$/);
      if (match) {
        name = _.camelCase(match[1]);
        type = match[2];
      }

      if (this.options.debug) {
        console.log(`DicLoader: ${name} [${type}] -> ${path}`);
      }

      switch(type) {
        case 'class':
          dic.registerClass(name, mod);
          break;
        case 'async-factory':
          dic.asyncFactory(name, mod);
          break;
        case 'factory':
          dic.factory(name, mod);
          break;
        case 'instance':
          dic.instance(name, mod);
          break;
        default:
          throw new Error(`Type ${type} not supported`);
      }
    }
  }
}

module.exports = DicLoader;
