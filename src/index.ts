import { IMlKem } from './types';

let isNode = false;
try {
  isNode = typeof process !== 'undefined' && process.versions?.node != null;
} catch (e) {
  // Not in Node.js environment
}

let loadMlKem1024: () => Promise<IMlKem>;
let loadMlKem768: () => Promise<IMlKem>;
let loadMlKem512: () => Promise<IMlKem>;

if (isNode) {
  const node = await import('./node');
  loadMlKem1024 = node.loadMlKem1024;
  loadMlKem768 = node.loadMlKem768;
  loadMlKem512 = node.loadMlKem512;
} else {
  const browser = await import('./browser');
  loadMlKem1024 = browser.loadMlKem1024;
  loadMlKem768 = browser.loadMlKem768;
  loadMlKem512 = browser.loadMlKem512;
}

export { loadMlKem1024, loadMlKem768, loadMlKem512 };
export type { IMlKem }; 