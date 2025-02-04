import { Header } from "@/components/header/header";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/plugin-opener", () => {
  return {
    openUrl: vi.fn(),
  };
});

describe("Header", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls openUrl with the document URL when the first button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    render(<Header />);

    // Act
    await user.click(screen.getByTestId("document-button"));

    expect(openUrl).toHaveBeenCalledTimes(1);
    expect(openUrl).toHaveBeenCalledWith("https://khokao.github.io/synergetica/");
  });

  it("calls openUrl with the GitHub URL when the first button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    render(<Header />);

    // Act
    await user.click(screen.getByTestId("github-button"));

    expect(openUrl).toHaveBeenCalledTimes(1);
    expect(openUrl).toHaveBeenCalledWith("https://github.com/khokao/synergetica");
  });

  it("displays document tooltip", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Header />);

    // Act
    await user.hover(screen.getByTestId("document-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Document");
    });
  });

  it("displays GitHub tooltip", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Header />);

    // Act
    await user.hover(screen.getByTestId("github-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("GitHub");
    });
  });

  it("renders the banner image", () => {
    // Arrange & Act
    render(<Header />);

    // Assert
    expect(screen.getByAltText("Banner")).toBeInTheDocument();
  });
});
