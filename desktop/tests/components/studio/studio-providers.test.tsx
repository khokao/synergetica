import { StudioProviders } from "@/components/studio/studio-providers";
import { render, screen } from "@testing-library/react";

describe("StudioProviders", () => {
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

  it("renders children within all providers", () => {
    // Arrange & Act
    render(
      <StudioProviders>
        <div data-testid="child-content">Child Content</div>
      </StudioProviders>,
    );

    // Assert
    expect(screen.getByTestId("child-content")).toHaveTextContent("Child Content");
  });
});
