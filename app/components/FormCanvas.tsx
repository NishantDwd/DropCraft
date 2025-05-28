import React, { useRef } from "react";
import { useFormStore } from "~/store/formStore";

export default function FormCanvas() {
  const {
    fields,
    addField,
    selectedFieldId,
    setSelectedField,
    reorderFields,
    removeField, // <-- add this
    currentStep,
    setCurrentStep,
    steps,
  } = useFormStore();

  const dragItem = useRef<number | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("field-type");
    if (["text", "textarea", "dropdown", "checkbox", "date"].includes(type)) {
      addField(type as any);
    }
  };

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragItem.current !== null && dragItem.current !== idx) {
      reorderFields(dragItem.current, idx);
      dragItem.current = idx;
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex-1 min-h-[80vh] p-4 bg-gray-50 dark:bg-gray-900 rounded overflow-y-auto"
    >
      <div className="flex items-center mb-4 gap-2">
        <span>Step:</span>
        {[...Array(steps)].map((_, i) => (
          <button
            key={i}
            className={`px-2 py-1 rounded ${currentStep === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setCurrentStep(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-3">Form</h2>
      {fields.filter(f => f.step === currentStep).map((field, idx) => (
        <div
          key={field.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onClick={() => setSelectedField(field.id)}
          className={`p-3 mb-2 border rounded cursor-pointer flex items-center gap-2 ${
            selectedFieldId === field.id ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <span className="cursor-move text-gray-400">&#9776;</span>
          <label className="block font-medium flex-1">{field.label || "Untitled"}</label>
          <input disabled placeholder={field.placeholder || ""} className="mt-1 p-2 w-full border" />
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              removeField(field.id);
            }}
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            title="Delete field"
          >
            &#10005;
          </button>
        </div>
      ))}
      {fields.filter(f => f.step === currentStep).length === 0 && (
        <p className="text-sm text-gray-500">Drag fields here to begin.</p>
      )}
    </div>
  );
}