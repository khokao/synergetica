import { StudioLayout } from "@/components/studio/studio-layout";
import { StudioProviders } from "@/components/studio/studio-providers";
import { render, screen } from "@testing-library/react";

describe("StudioLayout", () => {
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
