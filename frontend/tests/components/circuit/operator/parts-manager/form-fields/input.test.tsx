import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

describe("InputField Component", () => {
  it("renders label, description, and input with correct attributes", () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm();
      const props = {
        label: "name",
        description: "Please enter name.",
        fieldName: "name",
        form: form,
        type: "text",
        placeholder: "Enter name",
      };

      return (
        <FormProvider {...form}>
          <InputField {...props} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Please enter name.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });
});
