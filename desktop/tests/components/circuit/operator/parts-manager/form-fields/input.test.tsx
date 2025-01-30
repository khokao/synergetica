import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
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
        showErrorMessage: true,
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

  it("shows the error message when showErrorMessage is true and an error is set", async () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm({
        defaultValues: {
          name: "",
        },
      });
      const props = {
        label: "name",
        description: "Please enter name.",
        fieldName: "name",
        form: form,
        type: "text",
        placeholder: "Enter name",
        showErrorMessage: true,
      };

      // Set error after the form is initialized
      useEffect(() => {
        form.setError("name", {
          type: "required",
          message: "Name is required",
        });
      }, [form]);

      return (
        <FormProvider {...form}>
          <InputField {...props} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("does not show the error message when showErrorMessage is false even if an error is set", async () => {
    // Arrange
    const TestComponent = () => {
      const form = useForm({
        defaultValues: {
          name: "",
        },
      });
      const props = {
        label: "name",
        description: "Please enter name.",
        fieldName: "name",
        form: form,
        type: "text",
        placeholder: "Enter name",
        showErrorMessage: false,
      };

      // Set error after the form is initialized
      useEffect(() => {
        form.setError("name", {
          type: "required",
          message: "Name is required",
        });
      }, [form]);

      return (
        <FormProvider {...form}>
          <InputField {...props} />
        </FormProvider>
      );
    };

    // Act
    render(<TestComponent />);

    // Assert
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });
});
