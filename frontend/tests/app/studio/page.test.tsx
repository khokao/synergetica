import { render, screen } from "@testing-library/react";
import StudioPage from "@/app/studio/page";
import { describe, it, expect } from "vitest";

vi.mock("@/components/studio/studio", () => ({
  Studio: () => <div data-testid="studio-component">Studio Component</div>,
}));

describe("StudioPage", () => {
  it("renders the Studio component", () => {
    // Arrange & Act
    render(<StudioPage />);

    // Assert
    expect(screen.getByTestId("studio-component")).toBeInTheDocument();
    expect(screen.getByText("Studio Component")).toBeInTheDocument();
  });
});
