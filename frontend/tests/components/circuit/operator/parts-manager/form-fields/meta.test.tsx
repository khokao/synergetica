import { MetaFields } from "@/components/circuit/operator/parts-manager/form-fields/meta";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

describe("MetaFields Component", () => {
  it("renders meta fields with correct labels and descriptions", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      return (
        <FormProvider {...form}>
          <MetaFields form={form} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    expect(screen.getByText("Meta")).toBeInTheDocument();
    expect(screen.getByText("Meta description")).toBeInTheDocument();

    const fields = [
      { label: "Pmax", description: "Pmax description" },
      { label: "Ymax", description: "Ymax description" },
      { label: "Ymin", description: "Ymin description" },
      { label: "K", description: "K description" },
      { label: "n", description: "n description" },
      { label: "Dp", description: "Dp description" },
    ];
    for (const field of fields) {
      expect(screen.getByText(field.label)).toBeInTheDocument();
      expect(screen.getByText(field.description)).toBeInTheDocument();
    }
  });

  it("renders input fields with correct types", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      return (
        <FormProvider {...form}>
          <MetaFields form={form} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    const inputFields = screen.getAllByRole("spinbutton"); // Spinbutton is the role for number inputs
    expect(inputFields).toHaveLength(6); // There should be 6 input fields
    for (const input of inputFields) {
      expect(input).toHaveAttribute("type", "number");
    }
  });
});
