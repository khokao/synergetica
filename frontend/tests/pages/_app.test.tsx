import App from "@/pages/_app";
import { render } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import type { AppProps } from "next/app";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/router", () => require("next-router-mock"));

describe("App Component", () => {
  it("renders without crashing", () => {
    const DummyComponent = () => <div>Test Component</div>;
    const appProps: AppProps = {
      Component: DummyComponent,
      pageProps: {},
      router: undefined,
    };

    const { getByText } = render(
      <MemoryRouterProvider>
        <App {...appProps} />
      </MemoryRouterProvider>,
    );

    expect(getByText("Test Component")).toBeInTheDocument();
  });
});
