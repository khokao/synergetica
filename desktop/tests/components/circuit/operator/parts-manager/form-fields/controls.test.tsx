import { ControlFields } from "@/components/circuit/operator/parts-manager/form-fields/controls";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  const promoterParts = {
    testPromoterName: {
      name: "testPromoterName",
      description: "Test Promoter Description",
      category: "Promoter",
      controlBy: [],
    },
  };
  const proteinParts = {
    testProteinName: {
      name: "testProteinName",
      description: "Test Protein Description",
      category: "Protein",
      controlBy: [],
    },
  };
  const terminatorParts = {
    testTerminatorName: {
      name: "testTerminatorName",
      description: "Test Terminator Description",
      category: "Terminator",
      controlBy: [],
    },
  };

  return {
    useParts: () => ({
      parts: {
        ...promoterParts,
        ...proteinParts,
        ...terminatorParts,
      },
      promoterParts: promoterParts,
      proteinParts: proteinParts,
      terminatorParts: terminatorParts,
    }),
  };
});

describe("ControlFields Component", () => {
  it("renders label and description correctly", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm({
        defaultValues: {
          controls: [],
        },
      });
      return (
        <FormProvider {...form}>
          <ControlFields form={form} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    expect(screen.getByText("Controlled By")).toBeInTheDocument();
    expect(screen.getByText("Interactions for proteins controlling this promoter.")).toBeInTheDocument();
  });

  it("allows appending a new control field", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm({
        defaultValues: {
          controls: [],
        },
      });
      return (
        <TooltipProvider>
          <FormProvider {...form}>
            <ControlFields form={form} />
          </FormProvider>
        </TooltipProvider>
      );
    };

    render(<TestComponent />);

    // Act
    fireEvent.click(screen.getByTestId("field-array-append-button"));

    // Assert
    expect(screen.getByText("# 1")).toBeInTheDocument();
    expect(screen.getByText("Select part")).toBeInTheDocument();
    expect(screen.getByText("Select type")).toBeInTheDocument();
    expect(screen.getByText("Ymax")).toBeInTheDocument();
    expect(screen.getByText("Ymin")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("n")).toBeInTheDocument();
  });

  it("allows removing a control field", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm({
        defaultValues: {
          controlBy: [{ name: "part1", type: "Repression" }],
        },
      });
      return (
        <TooltipProvider>
          <FormProvider {...form}>
            <ControlFields form={form} />
          </FormProvider>
        </TooltipProvider>
      );
    };

    render(<TestComponent />);

    // Act
    fireEvent.click(screen.getByTestId("field-array-remove-button"));

    // Assert
    expect(screen.queryByText("# 1.")).not.toBeInTheDocument();
  });

  it("selects a part and type correctly", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm({
        defaultValues: {
          controlBy: [{ name: "", type: "" }],
        },
      });
      return (
        <TooltipProvider>
          <FormProvider {...form}>
            <ControlFields form={form} />
          </FormProvider>
        </TooltipProvider>
      );
    };

    render(<TestComponent />);

    // Act
    fireEvent.click(screen.getByText("Select part"));
    fireEvent.click(screen.getByText("testProteinName"));

    fireEvent.click(screen.getByText("Select type"));
    fireEvent.click(screen.getByText("Repression"));

    // Assert
    expect(screen.getByText("testProteinName")).toBeInTheDocument();
    expect(screen.getByText("Repression")).toBeInTheDocument();
  });
});
