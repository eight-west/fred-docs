import '@testing-library/jest-dom';

const observerCallbacks = new Map<Element, IntersectionObserverCallback>();

class MockIntersectionObserver {
  constructor(public cb: IntersectionObserverCallback) {}
  observe(el: Element) { observerCallbacks.set(el, this.cb); }
  unobserve(el: Element) { observerCallbacks.delete(el); }
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
  root = null;
  rootMargin = '';
  thresholds = [];
}

(global as any).IntersectionObserver = MockIntersectionObserver;

(global as any).__triggerIntersection = (el: Element, isIntersecting: boolean) => {
  const cb = observerCallbacks.get(el);
  if (cb) {
    cb(
      [{ isIntersecting, target: el } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  }
};

(global as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
  setTimeout(() => cb(performance.now()), 0) as unknown as number;
(global as any).cancelAnimationFrame = (id: number) => clearTimeout(id);

afterEach(() => {
  observerCallbacks.clear();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

beforeEach(() => {
  (global as any).fetch = jest.fn();
});
