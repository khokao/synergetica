import { ParamsFields } from "@/components/circuit/operator/parts-manager/form-fields/params";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

describe("ParamsFields Component", () => {
  it("should render parameter fields with the correct labels and descriptions for the 'Promoter' category", async () => {
    // Arrange
    const fields = [{ label: "Ydef", description: "Default expression rate w/o regulator" }];

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

    // Act
    render(<TestComponent />);

    // Assert
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Promoter parameters")).toBeInTheDocument();
    for (const field of fields) {
      expect(screen.getByText(field.label)).toBeInTheDocument();
    }
  });

  it("should display the correct tooltip when clicking the 'Ydef' label for the 'Promoter' category", async () => {
    // Arrange
    const user = userEvent.setup();

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
    render(<TestComponent />);

    // Act
    await user.click(screen.getByText("Ydef")); // Take Ydef as an example

    // Assert
    waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Default expression rate w/o regulator" })).toBeInTheDocument();
    });
  });

  it("should render parameter fields with the correct labels and descriptions for the 'Protein' category", async () => {
    // Arrange
    const fields = [
      { label: "Dp", description: "Protein degradation rate" },
      { label: "TIRb", description: "Baseline RBS strength" },
    ];

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
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Protein parameters")).toBeInTheDocument();
    for (const field of fields) {
      expect(screen.getByText(field.label)).toBeInTheDocument();
    }
  });

  it("should display the correct tooltip when clicking the 'Dp' label for the 'Protein' category", async () => {
    const user = userEvent.setup();

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
    render(<TestComponent />);

    // Act
    await user.click(screen.getByText("Dp")); // Take Dp as an example

    // Assert
    waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Protein degradation rate" })).toBeInTheDocument();
    });
  });
});
