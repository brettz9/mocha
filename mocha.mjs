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
  const mochaInstance = globalThis.mocha;

  // Don't call ui() here - let users call mocha.setup() to choose their interface
  // Export functions that dynamically reference globalThis so they work after setup()
  mochaExports = {
    get afterEach() { return globalThis.afterEach; },
    get after() { return globalThis.after; },
    get beforeEach() { return globalThis.beforeEach; },
    get before() { return globalThis.before; },
    get describe() { return globalThis.describe; },
    get it() { return globalThis.it; },
    get xdescribe() { return globalThis.xdescribe; },
    get xit() { return globalThis.xit; },
    get setup() { return globalThis.setup; },
    get suiteSetup() { return globalThis.suiteSetup; },
    get suiteTeardown() { return globalThis.suiteTeardown; },
    get suite() { return globalThis.suite; },
    get teardown() { return globalThis.teardown; },
    get test() { return globalThis.test; },
    get xspecify() { return globalThis.xspecify; },
    get specify() { return globalThis.specify; },
    get context() { return globalThis.context; },
    get xcontext() { return globalThis.xcontext; },
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
  xspecify,
  specify,
  context,
  xcontext,
  run
} = mochaExports;
