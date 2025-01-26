import { StudioLayout } from "@/components/studio/studio-layout";
import { StudioProviders } from "@/components/studio/studio-providers";
import { render, screen } from "@testing-library/react";

describe("StudioLayout", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as unknown as ReturnType<typeof vi.fn>).mockRestore();
    (console.log as unknown as ReturnType<typeof vi.fn>).mockRestore();
    (console.warn as unknown as ReturnType<typeof vi.fn>).mockRestore();
  });

  it("renders left, center, and right panels", () => {
    // Arrange & Act
    render(
      <StudioProviders>
        <StudioLayout />
      </StudioProviders>,
    );

    expect(screen.getByTestId("left-panel")).toBeInTheDocument();
    expect(screen.getByTestId("center-panel")).toBeInTheDocument();
    expect(screen.getByTestId("right-panel")).toBeInTheDocument();
  });
});
