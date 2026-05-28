import "@testing-library/jest-dom";

// Server-route tests opt into @jest-environment node, where `window` is
// undefined. Guard the jsdom-only polyfills so the setup file is env-agnostic
// — without the guard, every node-env test crashes on load with
// ReferenceError: window is not defined.
if (typeof window !== "undefined") {
  // JSDOM does not implement `window.matchMedia`. Several components query it
  // to honour `prefers-reduced-motion`; without this polyfill they throw on
  // render and break any test that mounts the full page tree.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // JSDOM does not implement IntersectionObserver. ComparisonSection +
  // FlavourGrid use it to trigger scroll-driven reveals; without a stub their
  // useEffect throws ReferenceError on first render.
  class IntersectionObserverStub {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn(() => []);
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverStub,
  });
  Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverStub,
  });
}
