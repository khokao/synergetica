import { ParamsFields } from "@/components/circuit/operator/parts-manager/form-fields/params";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

describe("MetaFields Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders params fields with correct labels and descriptions when category === Promoter", async () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      return (
        <TooltipProvider>
          <FormProvider {...form}>
            <ParamsFields form={form} category="Promoter" />
          </FormProvider>
        </TooltipProvider>
      );
    };

    const fields = [{ label: "Ydef", description: "Ydef description" }];

    // Act
    render(<TestComponent />);

    for (const field of fields) {
      await userEvent.hover(screen.getByTestId(`info-icon-${field.label}`));
    }
    vi.advanceTimersByTime(500);

    // Assert
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Promoter items description")).toBeInTheDocument();

    for (const field of fields) {
      expect(screen.getByText(field.label)).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole("tooltip", { name: field.description })).toBeInTheDocument();
      });
    }
  });

  it("renders params fields with correct labels and descriptions when category === Protein", async () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      return (
        <TooltipProvider>
          <FormProvider {...form}>
            <ParamsFields form={form} category="Protein" />
          </FormProvider>
        </TooltipProvider>
      );
    };

    const fields = [
      { label: "Dp", description: "Dp description" },
      { label: "TIRb", description: "TIRb description" },
    ];

    // Act
    render(<TestComponent />);

    for (const field of fields) {
      await userEvent.hover(screen.getByTestId(`info-icon-${field.label}`));
    }

    // Assert
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Protein items description")).toBeInTheDocument();

    for (const field of fields) {
      expect(screen.getByText(field.label)).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole("tooltip", { name: field.description })).toBeInTheDocument();
      });
    }
  });

  it("renders input fields with correct types", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      return (
        <TooltipProvider>
          <FormProvider {...form}>
            <ParamsFields form={form} category="Protein" />
          </FormProvider>
        </TooltipProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    const inputFields = screen.getAllByRole("spinbutton"); // Spinbutton is the role for number inputs
    expect(inputFields).toHaveLength(2); // There should be 2 input fields for protein.
    for (const input of inputFields) {
      expect(input).toHaveAttribute("type", "number");
    }
  });
});
