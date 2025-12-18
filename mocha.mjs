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

if (isBrowser) {
  // Browser: import the built bundle which sets up globalThis.Mocha and globalThis.mocha
  await import('./mocha.js');
  
  Mocha = globalThis.Mocha;
  // The global mocha instance is created by the bundle with ui() already called
  const mochaInstance = globalThis.mocha;
  
  // Initialize the UI to set up the context
  mochaInstance.ui('bdd');
  
  // Now export the test functions from the global scope (they're set up by ui())
  mochaExports = {
    afterEach: globalThis.afterEach,
    after: globalThis.after,
    beforeEach: globalThis.beforeEach,
    before: globalThis.before,
    describe: globalThis.describe,
    it: globalThis.it,
    xdescribe: globalThis.xdescribe,
    xit: globalThis.xit,
    setup: globalThis.setup,
    suiteSetup: globalThis.suiteSetup,
    suiteTeardown: globalThis.suiteTeardown,
    suite: globalThis.suite,
    teardown: globalThis.teardown,
    test: globalThis.test,
    run: mochaInstance.run.bind(mochaInstance)
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
  run
} = mochaExports;
