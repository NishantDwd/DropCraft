import React, { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { loadFormFromStorage, saveResponse, loadResponses } from "~/store/formStore";

export default function PublicFormFiller() {
  const { formId } = useParams();
  const [form, setForm] = useState<{ fields: any[]; meta: { name: string } } | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formId) {
      const loaded = loadFormFromStorage(formId);
      setForm(loaded);
    }
  }, [formId]);

  if (!form) return <div className="p-8">Form not found.</div>;

  const handleChange = (id: string, value: string) => {
    setValues(v => ({ ...v, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveResponse(formId!, values);
    setSubmitted(true);
  };

  if (submitted) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl shadow-lg p-10 flex flex-col items-center">
        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2l4-4" />
        </svg>
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-200 mb-2">{form.meta.name}</h2>
        <p className="text-lg text-green-800 dark:text-green-100 font-semibold">Thank you for your submission!</p>
      </div>
    </div>
  );
}

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{form.meta.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.fields.map(field => (
          <div key={field.id}>
            <label className="block font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === "text" || field.type === "date" ? (
              <input
                type={field.type === "date" ? "date" : "text"}
                value={values[field.id] || ""}
                required={field.required}
                placeholder={field.placeholder}
                onChange={e => handleChange(field.id, e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : field.type === "textarea" ? (
              <textarea
                value={values[field.id] || ""}
                required={field.required}
                placeholder={field.placeholder}
                onChange={e => handleChange(field.id, e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : field.type === "dropdown" ? (
              <select
                value={values[field.id] || ""}
                required={field.required}
                onChange={e => handleChange(field.id, e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select an option</option>
                {field.options?.map((opt: string, idx: number) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <div>
                {field.options?.map((opt: string, idx: number) => (
                  <label key={idx} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={(values[field.id] || "").split(",").includes(opt)}
                      onChange={e => {
                        const checked = e.target.checked;
                        let newValue = values[field.id] || "";
                        const arr = newValue ? newValue.split(",") : [];
                        if (checked) arr.push(opt);
                        else arr.splice(arr.indexOf(opt), 1);
                        handleChange(field.id, arr.join(","));
                      }}
                      className="mr-1"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : null}
            {field.helpText && <small className="text-gray-500">{field.helpText}</small>}
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}