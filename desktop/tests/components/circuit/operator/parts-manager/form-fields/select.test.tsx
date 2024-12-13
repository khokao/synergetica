import { SelectField } from "@/components/circuit/operator/parts-manager/form-fields/select";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

describe("SelectField Component", () => {
  it("renders label, description, and select with correct options", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      const props = {
        label: "Category",
        description: "Please select category.",
        fieldName: "category",
        form: form,
        placeholder: "Select a category",
        options: ["Promoter", "Protein", "Terminator"],
      };

      return (
        <FormProvider {...form}>
          <SelectField {...props} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Please select category.")).toBeInTheDocument();
    expect(screen.getByText("Select a category")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Select a category"));
    expect(screen.getByText("Promoter")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByText("Terminator")).toBeInTheDocument();
  });

  it("updates the value when an option is selected", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      const props = {
        label: "Category",
        description: "Please select category.",
        fieldName: "category",
        form: form,
        placeholder: "Select a category",
        options: ["Promoter", "Protein", "Terminator"],
      };

      return (
        <FormProvider {...form}>
          <SelectField {...props} />
        </FormProvider>
      );
    };

    render(<TestComponent />);

    // Act
    fireEvent.click(screen.getByText("Select a category"));
    fireEvent.click(screen.getByText("Terminator"));

    // Assert
    expect(screen.getByText("Terminator")).toBeInTheDocument();
  });
});
