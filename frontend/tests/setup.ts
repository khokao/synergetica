import "@testing-library/jest-dom";

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

window.HTMLElement.prototype.scrollIntoView = vi.fn();
