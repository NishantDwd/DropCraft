import React, { useState } from "react";
import { useFormStore } from "~/store/formStore";
import type { FormField } from "~/store/formStore"; 

const previewModes = [
  { label: "Desktop", width: "100%" },
  { label: "Tablet", width: "600px" },
  { label: "Mobile", width: "375px" },
];

export default function FormPreview() {
  const { fields, steps, currentStep, setCurrentStep } = useFormStore();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [mode, setMode] = useState(0);

  const fieldsForStep = fields.filter((f) => f.step === currentStep);

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) return "This field is required.";
    if (field.minLength && value.length < field.minLength)
      return `Minimum length is ${field.minLength}`;
    if (field.maxLength && value.length > field.maxLength)
      return `Maximum length is ${field.maxLength}`;
    if (field.pattern && value && !new RegExp(field.pattern).test(value))
      return "Invalid format.";
    if (field.label.toLowerCase().includes("email")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) return "Invalid email address.";
    }
    if (field.label.toLowerCase().includes("phone")) {
      const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
      if (value && !phoneRegex.test(value)) return "Invalid phone number.";
    }
    return null;
  };

  const errors = fieldsForStep.reduce((acc, field) => {
    const value = formValues[field.id] || "";
    const error = validateField(field, value);
    if (error) acc[field.id] = error;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-md min-h-[80vh] overflow-auto">
      <div className="flex gap-2 mb-2">
        {previewModes.map((m, i) => (
          <button
            key={m.label}
            className={`px-2 py-1 rounded ${mode === i ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode(i)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div style={{ width: previewModes[mode].width, margin: "0 auto" }}>
        <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
        <form>
          {fieldsForStep.length === 0 && <p className="text-gray-500">Add fields to preview the form.</p>}
          {fieldsForStep.map((field) => {
            const value = formValues[field.id] || "";
            const error = validateField(field, value);

            switch (field.type) {
              case "text":
              case "date":
                return (
                  <div key={field.id} className="mb-4">
                    <label className="block font-medium mb-1" htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={field.id}
                      type={field.type === "date" ? "date" : "text"}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={value}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.id]: e.target.value }))}
                      className={`w-full p-2 border rounded ${
                        error ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {field.helpText && <small className="text-gray-500">{field.helpText}</small>}
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                  </div>
                );
              case "textarea":
                return (
                  <div key={field.id} className="mb-4">
                    <label className="block font-medium mb-1" htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={value}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.id]: e.target.value }))}
                      className={`w-full p-2 border rounded ${
                        error ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {field.helpText && <small className="text-gray-500">{field.helpText}</small>}
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                  </div>
                );
              case "dropdown":
                return (
                  <div key={field.id} className="mb-4">
                    <label className="block font-medium mb-1" htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                      id={field.id}
                      required={field.required}
                      value={value}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.id]: e.target.value }))}
                      className={`w-full p-2 border rounded ${
                        error ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {field.helpText && <small className="text-gray-500">{field.helpText}</small>}
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                  </div>
                );
              case "checkbox":
                return (
                  <div key={field.id} className="mb-4">
                    <fieldset>
                      <legend className="font-medium mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </legend>
                      {field.options?.map((opt, idx) => (
                        <label key={idx} className="inline-flex items-center mr-4">
                          <input
                            type="checkbox"
                            name={field.id}
                            value={opt}
                            checked={(formValues[field.id] || "").split(",").includes(opt)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let newValue = formValues[field.id] || "";
                              const values = newValue ? newValue.split(",") : [];
                              if (checked) values.push(opt);
                              else {
                                const i = values.indexOf(opt);
                                if (i > -1) values.splice(i, 1);
                              }
                              setFormValues((v) => ({ ...v, [field.id]: values.join(",") }));
                            }}
                            className="mr-1"
                          />
                          {opt}
                        </label>
                      ))}
                    </fieldset>
                    {field.helpText && <small className="text-gray-500">{field.helpText}</small>}
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                  </div>
                );
              default:
                return null;
            }
          })}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentStep === steps || Object.keys(errors).length > 0}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="mt-2">
            <span>
              Step {currentStep} of {steps}
            </span>
            <div className="w-full bg-gray-200 h-2 rounded mt-1">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${(currentStep / steps) * 100}%` }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}