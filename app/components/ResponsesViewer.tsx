import React, { useEffect, useState } from "react";
import { loadFormFromStorage, loadResponses } from "~/store/formStore";

export default function ResponsesViewer({ formId }: { formId: string }) {
  const [form, setForm] = useState<{ fields: any[]; meta: { name: string } } | null>(null);
  const [responses, setResponses] = useState<{ response: Record<string, string>; date: string }[]>([]);

  useEffect(() => {
    setForm(loadFormFromStorage(formId));
    setResponses(loadResponses(formId));
  }, [formId]);

  if (!form)
    return (
      <div className="p-8 flex flex-col items-center">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <div className="text-gray-500 text-lg">Form not found.</div>
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300">
          Responses for: <span className="text-gray-900 dark:text-white">{form.meta.name}</span>
        </h2>
      </div>
      {responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p className="text-gray-500 text-lg">No responses yet for this form.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-blue-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">Date</th>
                {form.fields.map(f => (
                  <th key={f.id} className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {responses.map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200 font-mono">
                    {new Date(r.date).toLocaleString()}
                  </td>
                  {form.fields.map(f => (
                    <td key={f.id} className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                      {r.response[f.id] || <span className="text-gray-400 italic">-</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}