import { StudioProviders } from "@/components/studio/studio-providers";
import { render, screen } from "@testing-library/react";

describe("StudioProviders", () => {
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
