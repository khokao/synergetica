import { Studio } from "@/components/studio/studio";
import { render, screen } from "@testing-library/react";

describe("Studio", () => {
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

  it("renders the studio layout within providers", () => {
    // Arrange & Act
    render(<Studio />);

    // Assert
    expect(screen.getByTestId("studio")).toBeInTheDocument();
  });
});
