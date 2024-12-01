import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { toast } from "react-toastify"; // Import react-toastify
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Loader from "../Loader/Loader";

// Reusable Form Component
const FormComponent = ({ title, fields, onSubmit, submitButtonText }) => {
  const navigate = useNavigate(); // Initialize the navigate function for routing

  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect form data
    const formData = Object.fromEntries(new FormData(e.target).entries());

    // Check for isRequired fields
    const missingFields = fields.filter(
      (field) => field.isRequired && !formData[field.name],
    );

    if (missingFields.length > 0) {
      // If there are missing isRequired fields, show a toast error
      toast.error(
        `Please fill out the isRequired fields: ${missingFields
          .map((field) => field.label)
          .join(", ")}`,
      );
      return; // Don't proceed with form submission
    }

    // Proceed with the form submission if all isRequired fields are filled
    onSubmit(formData)
      .then(() => {
        toast.success("Form submitted successfully!"); // Success toast
      })
      .catch((error) => {
        toast.error(`Error: ${error.message || "Something went wrong!"}`); // Error toast
      });
  };

  // Navigate back to the onboarding screen
  const handleBackToOnboarding = () => {
    navigate("/onboarding"); // Replace with the correct path for your onboarding screen
  };

  return (
    <Card color="transparent" shadow={false}>
      <h4 className="text-blue-gray text-center">{title}</h4>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 px-4 py-2 lg:px-8 lg:py-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-1 flex flex-col gap-6">
          {fields.map((field, index) => (
            <div key={index}>
              <h6 className="text-blue-gray -mb-3">{field.label}</h6>
              <Input
                type={field.type}
                name={field.name}
                size="lg"
                placeholder={field.placeholder}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          ))}
        </div>
        <Button type="submit" color="blue" className="mt-6" fullWidth>
          {submitButtonText}
        </Button>
      </form>

      <span
        className="mt-4 text-sm absolute cursor-pointer top-[100%] right-[5%] lg:right-[-30%]"
        onClick={handleBackToOnboarding}
      >
        Back
      </span>
    </Card>
  );
};

export default FormComponent;
