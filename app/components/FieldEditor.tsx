import React from "react";
import { useFormStore } from "~/store/formStore";

export default function FieldEditor() {
  const { fields, selectedFieldId, updateField, steps, setSteps } = useFormStore();
  const selected = fields.find((f) => f.id === selectedFieldId);

  if (!selected)
    return <div className="w-1/4 border-l p-4 text-sm text-gray-500">Select a field</div>;

  return (
    <div className="w-1/4 border-l p-4">
      <h2 className="font-semibold text-lg mb-2">Edit Field</h2>
      <div className="space-y-2">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Label"
          value={selected.label}
          onChange={(e) => updateField(selected.id, { label: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Placeholder"
          value={selected.placeholder}
          onChange={(e) => updateField(selected.id, { placeholder: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Help Text"
          value={selected.helpText}
          onChange={(e) => updateField(selected.id, { helpText: e.target.value })}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selected.required}
            onChange={(e) => updateField(selected.id, { required: e.target.checked })}
          />
          <span>Required</span>
        </label>
        {(selected.type === "dropdown" || selected.type === "checkbox") && (
          <div>
            <label className="block font-medium">Options</label>
            {(selected.options || []).map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={opt}
                  className="flex-1 p-1 border rounded"
                  onChange={(e) => {
                    const newOpts = [...(selected.options || [])];
                    newOpts[idx] = e.target.value;
                    updateField(selected.id, { options: newOpts });
                  }}
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
                    const newOpts = [...(selected.options || [])];
                    newOpts.splice(idx, 1);
                    updateField(selected.id, { options: newOpts });
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600"
              onClick={() =>
                updateField(selected.id, {
                  options: [
  ...(selected.options || []),
  `Option ${(selected.options ? selected.options.length : 0) + 1}`,
],
                })
              }
            >
              + Add Option
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Min Length"
            value={selected.minLength || ""}
            onChange={(e) => updateField(selected.id, { minLength: e.target.value ? Number(e.target.value) : undefined })}
          />
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Max Length"
            value={selected.maxLength || ""}
            onChange={(e) => updateField(selected.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Pattern (regex)"
          value={selected.pattern || ""}
          onChange={(e) => updateField(selected.id, { pattern: e.target.value })}
        />
        <div>
          <label className="block font-medium">Step</label>
          <select
            value={selected.step || 1}
            onChange={(e) => updateField(selected.id, { step: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          >
            {Array.from({ length: steps }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Step {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Total Steps</label>
          <input
            type="number"
            min={1}
            max={10}
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}