/**
 * ESM wrapper for Mocha
 *
 * This module provides ESM exports for both Node.js and browser environments.
 * - In Node.js: imports the CommonJS entry point
 * - In browser: imports the built mocha.js bundle and exports from the global mocha instance
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

let Mocha;
let mochaExports;
let mocha;

if (isBrowser) {
  // Browser: import the built bundle which sets up globalThis.Mocha and globalThis.mocha
  await import('./mocha.js');

  Mocha = globalThis.Mocha;
  mocha = globalThis.mocha;

  // Don't call setup() - let users choose their interface
  // Export wrapper functions that dynamically access globalThis
  mochaExports = {
    afterEach: (...args) => globalThis.afterEach?.(...args),
    after: (...args) => globalThis.after?.(...args),
    beforeEach: (...args) => globalThis.beforeEach?.(...args),
    before: (...args) => globalThis.before?.(...args),
    describe: (...args) => globalThis.describe?.(...args),
    it: (...args) => globalThis.it?.(...args),
    xdescribe: (...args) => globalThis.xdescribe?.(...args),
    xit: (...args) => globalThis.xit?.(...args),
    setup: (...args) => globalThis.setup?.(...args),
    suiteSetup: (...args) => globalThis.suiteSetup?.(...args),
    suiteTeardown: (...args) => globalThis.suiteTeardown?.(...args),
    suite: (...args) => globalThis.suite?.(...args),
    teardown: (...args) => globalThis.teardown?.(...args),
    test: (...args) => globalThis.test?.(...args),
    xspecify: (...args) => globalThis.xspecify?.(...args),
    specify: (...args) => globalThis.specify?.(...args),
    context: (...args) => globalThis.context?.(...args),
    xcontext: (...args) => globalThis.xcontext?.(...args),
    run: mocha.run.bind(mocha)
  };
} else {
  // Node.js: use createRequire to load CommonJS module
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  Mocha = require('./index.js');
  mochaExports = Mocha;
}

// Re-export the Mocha class as default export
export default Mocha;

// Export the mocha instance (in browser, this has setup/run methods)
export { mocha };

// Re-export class/utility exports from the Mocha module
export const {
  utils,
  interfaces,
  reporters,
  Runnable,
  Context,
  Runner,
  Suite,
  Hook,
  Test
} = Mocha;

// Re-export test interface functions
export const {
  afterEach,
  after,
  beforeEach,
  before,
  describe,
  it,
  xdescribe,
  xit,
  setup,
  suiteSetup,
  suiteTeardown,
  suite,
  teardown,
  test,
  xspecify,
  specify,
  context,
  xcontext,
  run
} = mochaExports;
