import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
