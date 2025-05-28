import React from "react";
import { useFormStore } from "~/store/formStore";

const fields = [
  { type: "text", label: "Text Field" },
  { type: "textarea", label: "Textarea" },
  { type: "dropdown", label: "Dropdown" },
  { type: "checkbox", label: "Checkbox" },
  { type: "date", label: "Date" },
];

const contactUsTemplate = [
  {
    id: "name",
    type: "text",
    label: "Name",
    required: true,
    placeholder: "Your Name",
    helpText: "",
    step: 1,
  },
  {
    id: "email",
    type: "text",
    label: "Email",
    required: true,
    placeholder: "you@example.com",
    helpText: "",
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    step: 1,
  },
  {
    id: "message",
    type: "textarea",
    label: "Message",
    required: true,
    placeholder: "Type your message...",
    helpText: "",
    step: 1,
  },
];

export default function FieldPalette() {
  const addField = useFormStore((s) => s.addField);
  const loadTemplate = useFormStore((s) => s.loadTemplate);

  return (
    <div className="w-1/4 border-r p-4">
      <h2 className="font-semibold text-lg mb-2">Fields</h2>
      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("field-type", field.type)}
            onDoubleClick={() => addField(field.type as any)}
            className="p-2 border rounded cursor-grab hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {field.label}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => loadTemplate(contactUsTemplate as any)}
        >
          Load "Contact Us" Template
        </button>
      </div>
    </div>
  );
}