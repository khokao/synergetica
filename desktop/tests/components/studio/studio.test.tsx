import { Studio } from "@/components/studio/studio";
import { render, screen } from "@testing-library/react";

describe("Studio", () => {
  test("renders the studio layout within providers", () => {
    // Arrange & Act
    render(<Studio />);

    // Assert
    expect(screen.getByTestId("studio")).toBeInTheDocument();
  });
});
